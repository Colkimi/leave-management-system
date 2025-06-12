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
  Logger,
} from '@nestjs/common';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application, LeaveType } from './entities/leave-application.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { EmailService } from 'src/notifications/email/email.service';
import { User } from 'src/profiles/entities/profile.entity';

@Injectable()
export class LeaveApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,

    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,

    @InjectRepository(Allotment)
    private allotmentRepository: Repository<Allotment>,

    @InjectRepository(Administrator)
    private administratorRepository: Repository<Administrator>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
  ) { }

  async create(createLeaveApplicationDto: CreateLeaveApplicationDto) {
    const { faculty_id, allotment_id, ...rest } =
      createLeaveApplicationDto;

    const faculty = await this.facultyRepository.findOneBy({ faculty_id });
    if (!faculty) {
      throw new NotFoundException(`Faculty with id ${faculty_id} not found`);
    }

    const allotment = await this.allotmentRepository.findOneBy({
      allotment_id,
    });
    if (!allotment) {
      throw new NotFoundException(
        `Allotment with id ${allotment_id} not found`,
      );
    }



    const application = this.applicationRepository.create({
      ...rest,
      faculty,
      allotment,
    });

    const savedApplication = await this.applicationRepository.save(application);
    
    await this.cacheManager.del('leave_applications_all');

    try {
      const facultyWithUser = await this.facultyRepository.findOne({
        where: { faculty_id },
        relations: ['user']
      });
      if (facultyWithUser?.user?.email) {
        await this.emailService.sendLeaveApplicationNotification(
          facultyWithUser.user.email,
          savedApplication
        );
      }

    } catch (error) {
      console.error('Failed to send leave application notification', error.stack);
    }

    return savedApplication;
  }

  async findall(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

      await this.applicationRepository.find({
        skip,
        take: limit,
      });

  const cached = await this.cacheManager.get<Application[]>(
      'leave_applications_all',
    );
    if (cached) {
      return cached;
    }

    const applications = await this.applicationRepository.find({
      skip,
      take: limit,
    });
    await this.cacheManager.set('leave_applications_all', applications);
    return applications;
  }


  async findone(leave_id: number) {
    const cacheKey = `leave_application_${leave_id}`;
    const cached = await this.cacheManager.get<Application>(cacheKey);
    if (cached) {
      return cached;
    }

    const application = await this.applicationRepository.findOne({
      where: { leave_id },
    });
    return application;
  }

  async update(
    leave_id: number,
    updateLeaveApplicationDto: UpdateLeaveApplicationDto,
  ) {
    const application = await this.applicationRepository.findOne({
      where: { leave_id },
    });
    if (!application) {
      throw new NotFoundException(`application with id ${leave_id} not found`);
    }

    const { faculty_id, allotment_id, ...rest } =
      updateLeaveApplicationDto;

    if (faculty_id) {
      const faculty = await this.facultyRepository.findOneBy({ faculty_id });
      if (!faculty) {
        throw new NotFoundException(`Faculty with id ${faculty_id} not found`);
      }
      application.faculty = faculty;
    }
    if (allotment_id) {
      const allotment = await this.allotmentRepository.findOneBy({
        allotment_id,
      });
      if (!allotment) {
        throw new NotFoundException(
          `Allotment with id ${allotment_id} not found`,
        );
      }
      application.allotment = allotment;
    }

    Object.assign(application, rest);

    const updatedApplication =
      await this.applicationRepository.save(application);

    await this.cacheManager.del('leave_applications_all');
    await this.cacheManager.del(`leave_application_${leave_id}`);
    return updatedApplication;
  }

  async remove(leave_id: number) {
    const res = await this.applicationRepository.delete(leave_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `application with application id ${leave_id} not found`,
      );
    }

    await this.cacheManager.del('leave_applications_all');
    await this.cacheManager.del(`leave_application_${leave_id}`);
    return {
      message: `application with id ${leave_id} successfully removed from database`,
    };
  }
}
