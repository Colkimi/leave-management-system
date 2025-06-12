
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
  BadRequestException,
} from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Faculty } from './entities/faculty.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createFacultyDto: CreateFacultyDto) {
    await this.facultyRepository.findOne({
      where: { faculty_id: createFacultyDto.faculty_id },
    });

   const faculty = new Faculty();
    faculty.username = createFacultyDto.username;
    const savedFaculty = await this.facultyRepository.save(createFacultyDto);
    await this.cacheManager.del('faculties_all');
    return savedFaculty;
  }

  async findall(search?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    if (search) {
      return this.facultyRepository.find({
        where: [
          { faculty_name: Like(`%${search}%`) },
          { phone: Like(`%${search}%`) },
          { status: Like(`%${search}%`) },
        ],
        skip,
        take: limit,
      });
    }

    const faculties = await this.facultyRepository.find({
      skip,
      take: limit,
    });
    const cached = await this.cacheManager.get<Faculty[]>('faculties_all');
    if (cached) {
      return cached;
    }

    await this.cacheManager.set('faculties_all', faculties);
    return faculties;
  }

  async findone(faculty_id: number) {
    const cacheKey = `faculty_${faculty_id}`;
    const cached = await this.cacheManager.get<Faculty>(cacheKey);
    if (cached) {
      return cached;
    }

    const faculty = await this.facultyRepository.findOne({
      where: { faculty_id },
    });

    if (faculty) {
      await this.cacheManager.set(cacheKey, faculty, 30);
    }
    return faculty;
  }

  async update(faculty_id: number, UpdateFacultyDto) {
    const faculty = await this.facultyRepository.findOne({
      where: { faculty_id },
    });
    if (!faculty) {
      throw new NotFoundException(`faculty with id ${faculty_id} not found`);
    }
    const faculty_name = UpdateFacultyDto.faculty_name ?? faculty.faculty_name;
    const phone = UpdateFacultyDto.phone ?? faculty.phone;
    const status = UpdateFacultyDto.status ?? faculty.status;
    [faculty_name, phone, status];
    await this.facultyRepository.findOne({ where: { faculty_id } });
    const updatedFaculty = await this.facultyRepository.save(UpdateFacultyDto);

    await this.cacheManager.del('faculties_all');
    await this.cacheManager.del(`faculty_${faculty_id}`);
    return updatedFaculty;
  }

  async remove(faculty_id: number) {
    const res = await this.facultyRepository.delete(faculty_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `faculty with faculty id ${faculty_id} not found`,
      );
    }

    await this.cacheManager.del('faculties_all');
    await this.cacheManager.del(`faculty_${faculty_id}`);
    return {
      message: `faculty with id ${faculty_id} successfully removed from database`,
    };
  }
}
