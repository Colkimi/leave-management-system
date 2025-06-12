import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    const cached = await this.cacheManager.get<Department[]>('all_departments');
    if (cached) {
      return cached;
    }
    const department = await this.departmentRepository.find();
        await this.cacheManager.set('all_departments', department);
         return department;
   }

  async findone(department_id: number) {
    const cacheKey = `department_${department_id}`;
    const cached = await this.cacheManager.get<Department>(cacheKey);
    if (cached) {
      return cached;
    }
    const department = await this.departmentRepository.findOne({
      where: { department_id },
    });
    if (department) {
      await this.cacheManager.set(cacheKey, department);
    }
    return department;
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

    await this.cacheManager.del('departments_all');
    await this.cacheManager.del(`department_${department_id}`);
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
