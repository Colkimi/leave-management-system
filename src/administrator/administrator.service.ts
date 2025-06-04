import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
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

    // Hash the password before saving
    const hashedPassword = await this.hashPassword(createAdministratorDto.password);
    
    // Create new administrator with hashed password
    const administrator = new Administrator();
    administrator.username = createAdministratorDto.username;
    administrator.password = hashedPassword;
    administrator.email = createAdministratorDto.email;
    administrator.role = createAdministratorDto.role;

    return this.administratorRepository.save(administrator);
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
