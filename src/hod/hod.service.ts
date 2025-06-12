import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Hod } from './entities/hod.entity';
import { CreateHodDto } from './dto/create-hod.dto';
import { UpdateHodDto } from './dto/update-hod.dto';
import * as bcrypt from 'bcrypt';
import { FacultyService } from '../faculty/faculty.service';
import { DepartmentService } from '../department/department.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class HodService {
  constructor(
    @InjectRepository(Hod)
    private readonly hodRepository: Repository<Hod>,
    private readonly facultyService: FacultyService,
    private readonly departmentService: DepartmentService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createHodDto: CreateHodDto): Promise<Hod> {
    const { faculty_id, department_id, ...rest } = createHodDto;

    const faculty = await this.facultyService.findone(faculty_id);
    if (!faculty) {
      throw new NotFoundException(`Faculty with ID ${faculty_id} not found`);
    }

    const department = await this.departmentService.findone(department_id);
    if (!department) {
      throw new NotFoundException(
        `Department with ID ${department_id} not found`,
      );
    }

    const hod = this.hodRepository.create({
      ...rest,
      faculty,
      department,
    });

    const savedHod = await this.hodRepository.save(hod);
    await this.cacheManager.del('hods_all');
    return savedHod;
  }

  async findall(
    search?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Hod[]> {
    const skip = (page - 1) * limit;

    // If search is provided, filter by username, else no where clause
    const whereCondition = search
      ? { username: Like(`%${search}%`) }
      : {};

    const cached = await this.cacheManager.get<Hod[]>('hods_all');
    if (cached) {
      return cached;
    }

    const hods = await this.hodRepository.find({
      where: whereCondition,
      relations: ['faculty', 'department'],
      skip,
      take: limit,
    });

    await this.cacheManager.set('hods_all', hods);
    return hods;
  }

  async findone(id: number): Promise<Hod> {
    const cacheKey = `hod_${id}`;
    const cached = await this.cacheManager.get<Hod>(cacheKey);
    if (cached) {
      return cached;
    }

    const hod = await this.hodRepository.findOne({
      where: { hod_id: id },
      relations: ['faculty', 'department'],
    });
    if (!hod) {
      throw new NotFoundException(`HOD with ID ${id} not found`);
    }

    await this.cacheManager.set(cacheKey, hod, 30);
    return hod;
  }

  async update(id: number, updateHodDto: UpdateHodDto): Promise<Hod> {
    const hod = await this.findone(id);

    await this.hodRepository.update(id, updateHodDto);
    await this.cacheManager.del('hods_all');
    await this.cacheManager.del(`hod_${id}`);
    return this.findone(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.hodRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`HOD with ID ${id} not found`);
    }

    await this.cacheManager.del('hods_all');
    await this.cacheManager.del(`hod_${id}`);
  }

  async setRefreshToken(id: number, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.hodRepository.update(id, { hashedRefreshToken });
  }

  async removeRefreshToken(id: number): Promise<void> {
    await this.hodRepository.update(id, { hashedRefreshToken: null });
  }
}
