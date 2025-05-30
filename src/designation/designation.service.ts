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
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Designation } from './entities/designation.entity';
@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
  ) {}

  async create(createDesignationDto: CreateDesignationDto) {
    return this.designationRepository.save(createDesignationDto);
  }

  async findall(search?: string) {
    if (search) {
      return this.designationRepository.find({
        where: [{ designation_name: Like(`%${search}%`) }],
      });
    }
    return this.designationRepository.find();
  }

  async findone(designation_id: number) {
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
    return this.designationRepository.save(UpdateDesignationDto);
  }

  async remove(designation_id: number) {
    const res = await this.designationRepository.delete(designation_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `designation with designation id ${designation_id} not found`,
      );
    }
    return {
      message: `designation with designation id ${designation_id} successfully removed from database`,
    };
  }
}
