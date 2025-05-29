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
} from '@nestjs/common';
import { CreateLeaveAllotmentDto } from './dto/create-leave-allotment.dto';
import { UpdateLeaveAllotmentDto } from './dto/update-leave-allotment.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Allotment } from './entities/leave-allotment.entity';

@Injectable()
export class LeaveAllotmentService {
  constructor(
    @InjectRepository(Allotment)
    private allotmentRepository: Repository<Allotment>,
  ) {}

  async create(createLeaveAllotmentDto: CreateLeaveAllotmentDto) {
    await this.allotmentRepository.findOne({
      where: { allotment_id: createLeaveAllotmentDto.allotment_id },
    });
    return this.allotmentRepository.save(createLeaveAllotmentDto);
  }

  async findall(search?: string) {
    if (search) {
      return this.allotmentRepository.find({
        where: [
          { leave_type: Like(`%${search}%`) },
        ],
      });
    }
    return this.allotmentRepository.find();
  }

  async findone(allotment_id: number) {
    const allotment = await this.allotmentRepository.findOne({
      where: { allotment_id },
    });
    return allotment;
  }

  async update(allotment_id: number, UpdateLeaveAllotmentDto: UpdateLeaveAllotmentDto) {
    const allotment = await this.allotmentRepository.findOne({
      where: { allotment_id },
    });
    if (!allotment) {
      throw new NotFoundException(`allotment with id ${allotment_id} not found`);
    }
    const leave_type = UpdateLeaveAllotmentDto.leave_type ?? allotment.leave_type;
    const total_days = UpdateLeaveAllotmentDto.total_days ?? allotment.total_days;
    const remaining_days = UpdateLeaveAllotmentDto.remaining_days ?? allotment.remaining_days;
    [leave_type,total_days,remaining_days];
    await this.allotmentRepository.findOne({ where: { allotment_id } });
    return this.allotmentRepository.save(UpdateLeaveAllotmentDto);
  }

  async remove(allotment_id: number) {
    const res = await this.allotmentRepository.delete(allotment_id);
    if (res.affected === 0) {
      throw new NotFoundException(`allotment with allotment id ${allotment_id} not found`);
    }
    return {message: `allotment with id ${allotment_id} successfully removed from database`};
  }
}
