import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/profile.entity';
import { Repository } from 'typeorm';
import * as Bcrypt from 'bcrypt';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User) private profileRepository: Repository<User>,
  ) {}

  // This method hashes the password using bcrypt
  private async hashData(data: string): Promise<string> {
    const salt = await Bcrypt.genSalt(10);
    return await Bcrypt.hash(data, salt);
  }

  // Helper method to remove password from profile
  private excludePassword(profile: User): Partial<User> {
    const { password, hashedRefreshToken, ...rest } = profile;
    return rest;
  }

  async create(createProfileDto: CreateProfileDto): Promise<Partial<User>> {
    // Check if a profile with the same email already exists
    const existingProfile = await this.profileRepository.findOne({
      where: { email: createProfileDto.email },
      select: ['id'], // Only select the id to avoid loading the entire profile
    });
    if (existingProfile) {
      throw new Error(
        `User with email ${createProfileDto.email} already exists`,
      );
    }
    const newProfile = {
      firstName: createProfileDto.firstName,
      lastName: createProfileDto.lastName,
      email: createProfileDto.email,
      password: await this.hashData(createProfileDto.password),
      role: createProfileDto.role || 'FACULTY', 
    };
    // Create a new User entity
    const savedProfile = await this.profileRepository
      .save(newProfile)
      .then((profile) => {
        return profile;
      })
      .catch((error) => {
        console.error('Error creating profile:', error);
        throw new Error('Failed to create profile');
      });

    // Remove password from the returned profile
    return this.excludePassword(savedProfile);
  }

  async findAll(email?: string): Promise<Partial<User>[]> {
    let profiles: User[];
    if (email) {
      profiles = await this.profileRepository.find({
        where: {
          email: email,
        },
        relations: ['student'], // Ensure to load the student relation
      });
    } else {
      profiles = await this.profileRepository.find({
        relations: ['student'], // Ensure to load the student relation
      });
    }
    // Remove password from all profiles
    return profiles.map((profile) => this.excludePassword(profile));
  }

  async findOne(id: number): Promise<User> {
    const res = await this.profileRepository.findOneBy({ id });
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Remove password from the profile
    // return this.excludePassword(res);
    return res;
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Partial<User> | string> {
    // if the email is being updated, check if it already exists
    if (updateProfileDto.password) {
      // Hash the new password if provided
      updateProfileDto.password = await this.hashData(
        updateProfileDto.password,
      );
    }

    await this.profileRepository.update(id, updateProfileDto);

    return await this.findOne(id);
  }

  async remove(id: number): Promise<string> {
    return await this.profileRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `No profile found with id ${id}`;
        }
        return `User with id ${id} has been removed`;
      })
      .catch((error) => {
        console.error('Error removing profile:', error);
        throw new Error(`Failed to remove profile with id ${id}`);
      });
  }
}
