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
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Faculty } from './entities/faculty.entity';
import { setDefaultAutoSelectFamily } from 'net';
@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,
  ) {}

  async create(createFacultyDto: CreateFacultyDto) {
    await this.facultyRepository.findOne({
      where: { faculty_id: createFacultyDto.faculty_id },
    });
    return this.facultyRepository.save(createFacultyDto);
  }

  async findall(search?: string) {
    if (search) {
      return this.facultyRepository.find({
        where: [
          { faculty_name: Like(`%${search}%`) },
          { first_name: Like(`%${search}%`) },
          { last_name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { phone: Like(`%${search}%`) },
          { status: Like(`%${search}%`) },
        ],
      });
    }
    return this.facultyRepository.find();
  }

  async findone(faculty_id: number) {
    const faculty = await this.facultyRepository.findOne({
      where: { faculty_id },
    });
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
    const first_name = UpdateFacultyDto.first_name ?? faculty.first_name;
    const last_name = UpdateFacultyDto.last_name ?? faculty.last_name;
    const email = UpdateFacultyDto.email ?? faculty.email;
    const phone = UpdateFacultyDto.phone ?? faculty.phone;
    const status = UpdateFacultyDto.status ?? faculty.status;
    [faculty_name,first_name,last_name,email, phone, status];
    await this.facultyRepository.findOne({ where: { faculty_id } });
    return this.facultyRepository.save(UpdateFacultyDto);
  }

  async remove(faculty_id: number) {
    const res = await this.facultyRepository.delete(faculty_id);
    if (res.affected === 0) {
      throw new NotFoundException(`faculty with faculty id ${faculty_id} not found`);
    }
    return {message: `faculty with id ${faculty_id} successfully removed from database`};
  }
}
