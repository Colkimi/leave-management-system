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
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
  ) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    await this.administratorRepository.findOne({
      where: { admin_id: createAdministratorDto.admin_id },
    });
    return this.administratorRepository.save(createAdministratorDto);
  }

  async findall(search?: string) {
    if (search) {
      return this.administratorRepository.find({
        where: [
          { username: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { role: Like(`%${search}%`) },
        ],
      });
    }
    return this.administratorRepository.find();
  }

  async findone(admin_id: number) {
    const admin = await this.administratorRepository.findOne({
      where: { admin_id },
    });
    return admin;
  }

  async update(admin_id: number, UpdateAdministratorDto) {
    const admin = await this.administratorRepository.findOne({
      where: { admin_id },
    });
    if (!admin) {
      throw new NotFoundException(`admin with id ${admin_id} not found`);
    }
    const username = UpdateAdministratorDto.username ?? admin.username;
    const password = UpdateAdministratorDto.password ?? admin.password;
    const email = UpdateAdministratorDto.email ?? admin.email;
    const role = UpdateAdministratorDto.role ?? admin.role;
    [username, password, email, role];
    await this.administratorRepository.findOne({ where: { admin_id } });
    return this.administratorRepository.save(UpdateAdministratorDto);
  }

  async remove(admin_id: number) {
    const res = await this.administratorRepository.delete(admin_id);
    if (res.affected === 0) {
      throw new NotFoundException(`admin with admin id ${admin_id} not found`);
    }
    return {
      message: `admin with id ${admin_id} successfully removed from database`,
    };
  }
}
