import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/profiles/entities/profile.entity';
@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async create(createAdministratorDto: CreateAdministratorDto) {
    // Check if admin_id exists if provided
    if (createAdministratorDto.admin_id) {
      await this.administratorRepository.findOne({
        where: { admin_id: createAdministratorDto.admin_id },
      });
    }

    // Create new administrator with hashed password
    const administrator = new Administrator();
    administrator.username = createAdministratorDto.username;

    const savedAdmin = await this.administratorRepository.save(administrator);
    await this.cacheManager.del('administrators_all');
    return savedAdmin;
  }

  async findall(search?: string) {
    if (search) {
      return this.administratorRepository.find({
        where: [
          { username: Like(`%${search}%`) },
        ],
      });
    }
    // Try to get from cache
    const cached =
      await this.cacheManager.get<Administrator[]>('administrators_all');
    if (cached) {
      return cached;
    }
    const admins = await this.administratorRepository.find();
    await this.cacheManager.set('administrators_all', admins);
    return admins;
  }

  async findone(admin_id: number) {
    const cacheKey = `administrator_${admin_id}`;
    const cached = await this.cacheManager.get<Administrator>(cacheKey);
    if (cached) {
      return cached;
    }
    const admin = await this.administratorRepository.findOne({
      where: { admin_id },
    });
    if (admin) {
      await this.cacheManager.set(cacheKey, admin);
    }
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

    [username];

    const updatedAdmin = await this.administratorRepository.save(
      UpdateAdministratorDto,
    );
    // Invalidate cache after update
    await this.cacheManager.del('administrators_all');
    await this.cacheManager.del(`administrator_${admin_id}`);
    return updatedAdmin;
  }

  async remove(admin_id: number) {
    const res = await this.administratorRepository.delete(admin_id);
    if (res.affected === 0) {
      throw new NotFoundException(`admin with admin id ${admin_id} not found`);
    }
    // Invalidate cache after remove
    await this.cacheManager.del('administrators_all');
    await this.cacheManager.del(`administrator_${admin_id}`);
    return {
      message: `admin with id ${admin_id} successfully removed from database`,
    };
  }
}
