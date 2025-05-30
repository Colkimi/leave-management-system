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
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.departmentRepository.save(createDepartmentDto);
  }

  async findall(search?: string) {
    if (search) {
      return this.departmentRepository.find({
        where: [{ department_name: Like(`%${search}%`) }],
      });
    }
    return this.departmentRepository.find();
  }

  async findone(department_id: number) {
    const admin = await this.departmentRepository.findOne({
      where: { department_id },
    });
    return admin;
  }

  async update(
    department_id: number,
    UpdateDepartmentDto: UpdateDepartmentDto,
  ) {
    const department = await this.departmentRepository.findOne({
      where: { department_id },
    });
    if (!department) {
      throw new NotFoundException(
        `department with id ${department_id} not found`,
      );
    }
    const departmentname = UpdateDepartmentDto.department_name;
    [departmentname];
    await this.departmentRepository.findOne({ where: { department_id } });
    return this.departmentRepository.save(UpdateDepartmentDto);
  }

  async remove(department_id: number) {
    const res = await this.departmentRepository.delete(department_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `department with department id ${department_id} not found`,
      );
    }
    return {
      message: `department with department id ${department_id} successfully removed from database`,
    };
  }
}
