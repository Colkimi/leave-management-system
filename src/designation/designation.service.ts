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
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createDesignationDto: CreateDesignationDto) {
    const savedDesignation =
      await this.designationRepository.save(createDesignationDto);
    await this.cacheManager.del('designations_all');
    return savedDesignation;
  }

  async findall(search?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    if (search) {
      return this.designationRepository.find({
        where: [{ designation_name: Like(`%${search}%`) }],
        skip,
        take: limit,
      });
    }

    // const cached = await this.cacheManager.get<Designation[]>('designations_all');
    // if (cached) {
    //   return cached;
    // }

    const designations = await this.designationRepository.find({
      skip,
      take: limit,
    });
    // await this.cacheManager.set('designations_all', designations);
     return designations;
   }

  async findone(designation_id: number) {
    const cacheKey = `designation_${designation_id}`;
    const cached = await this.cacheManager.get<Designation>(cacheKey);
    if (cached) {
      return cached;
    }

    const designation = await this.designationRepository.findOne({
      where: { designation_id },
    });
    return designation;
  }

  async update(
    designation_id: number,
    UpdateDesignationDto: UpdateDesignationDto,
  ) {
    const designation = await this.designationRepository.findOne({
      where: { designation_id },
    });
    if (!designation) {
      throw new NotFoundException(
        `designation with id ${designation_id} not found`,
      );
    }
    const designation_name = UpdateDesignationDto.designation_name;
    [designation_name];
    await this.designationRepository.findOne({ where: { designation_id } });
    const updatedDesignation =
      await this.designationRepository.save(UpdateDesignationDto);

    await this.cacheManager.del('designations_all');
    await this.cacheManager.del(`designation_${designation_id}`);
    return updatedDesignation;
  }

  async remove(designation_id: number) {
    const res = await this.designationRepository.delete(designation_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `designation with designation id ${designation_id} not found`,
      );
    }

    await this.cacheManager.del('designations_all');
    await this.cacheManager.del(`designation_${designation_id}`);
    return {
      message: `designation with designation id ${designation_id} successfully removed from database`,
    };
  }
}
