import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { CreateLeaveAllotmentDto } from './dto/create-leave-allotment.dto';
import { UpdateLeaveAllotmentDto } from './dto/update-leave-allotment.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Allotment } from './entities/leave-allotment.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class LeaveAllotmentService {
  constructor(
    @InjectRepository(Allotment)
    private allotmentRepository: Repository<Allotment>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createLeaveAllotmentDto: CreateLeaveAllotmentDto) {
    await this.allotmentRepository.findOne({
      where: { allotment_id: createLeaveAllotmentDto.allotment_id },
    });
    const savedAllotment = await this.allotmentRepository.save(
      createLeaveAllotmentDto,
    );
    await this.cacheManager.del('leave_allotments_all');
    return savedAllotment;
  }

  async findall(search?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    if (search) {
      return this.allotmentRepository.find({
        where: [{ leave_type: Like(`%${search}%`) }],
        skip,
        take: limit,
      });
    }

    // const cached = await this.cacheManager.get<Allotment[]>(
    //   'leave_allotments_all',
    // );
    // if (cached) {
    //   return cached;
    // }
 
     const allotments = await this.allotmentRepository.find({
       skip,
       take: limit,
     });
     await this.cacheManager.set('leave_allotments_all', allotments);
     return allotments;
  }

  async findone(allotment_id: number) {
    const cacheKey = `leave_allotment_${allotment_id}`;
    const cached = await this.cacheManager.get<Allotment>(cacheKey);
    if (cached) {
      return cached;
    }

    const allotment = await this.allotmentRepository.findOne({
      where: { allotment_id },
    });

    if (allotment) {
      await this.cacheManager.set(cacheKey, allotment, 30);
    }
    return allotment;
  }

  async update(
    allotment_id: number,
    UpdateLeaveAllotmentDto: UpdateLeaveAllotmentDto,
  ) {
    const allotment = await this.allotmentRepository.findOne({
      where: { allotment_id },
    });
    if (!allotment) {
      throw new NotFoundException(
        `allotment with id ${allotment_id} not found`,
      );
    }
    const leave_type =
      UpdateLeaveAllotmentDto.leave_type ?? allotment.leave_type;
    const total_days =
      UpdateLeaveAllotmentDto.total_days ?? allotment.total_days;
    const remaining_days =
      UpdateLeaveAllotmentDto.remaining_days ?? allotment.remaining_days;
    [leave_type, total_days, remaining_days];
    await this.allotmentRepository.findOne({ where: { allotment_id } });
    const updatedAllotment = await this.allotmentRepository.save(
      UpdateLeaveAllotmentDto,
    );

    await this.cacheManager.del('leave_allotments_all');
    await this.cacheManager.del(`leave_allotment_${allotment_id}`);
    return updatedAllotment;
  }

  async remove(allotment_id: number) {
    const res = await this.allotmentRepository.delete(allotment_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `allotment with allotment id ${allotment_id} not found`,
      );
    }

    await this.cacheManager.del('leave_allotments_all');
    await this.cacheManager.del(`leave_allotment_${allotment_id}`);
    return {
      message: `allotment with id ${allotment_id} successfully removed from database`,
    };
  }
}
