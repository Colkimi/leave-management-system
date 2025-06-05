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
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/leave-application.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
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
  ) {}

  async create(createLeaveApplicationDto: CreateLeaveApplicationDto) {
    const { faculty_id, allotment_id, approved_by, ...rest } = createLeaveApplicationDto;

    const faculty = await this.facultyRepository.findOneBy({ faculty_id });
    if (!faculty) {
      throw new NotFoundException(`Faculty with id ${faculty_id} not found`);
    }

    const allotment = await this.allotmentRepository.findOneBy({ allotment_id });
    if (!allotment) {
      throw new NotFoundException(`Allotment with id ${allotment_id} not found`);
    }

    const administrator = await this.administratorRepository.findOneBy({ admin_id: approved_by });
    if (!administrator) {
      throw new NotFoundException(`Administrator with id ${approved_by} not found`);
    }

    const application = this.applicationRepository.create({
      ...rest,
      faculty,
      allotment,
      approvedBy: administrator,
    });

    return this.applicationRepository.save(application);
  }

  async findall(search?: string) {
    if (search) {
      return this.applicationRepository.find({
        where: [
          { leave_type: Like(`%${search}%`) },
          { status: Like(`%${search}%`) },
          { reason: Like(`%${search}%`) },
        ],
      });
    }
    return this.applicationRepository.find();
  }

  async findone(leave_id: number) {
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

    const { faculty_id, allotment_id, approved_by, ...rest } = updateLeaveApplicationDto;

    if (faculty_id) {
      const faculty = await this.facultyRepository.findOneBy({ faculty_id });
      if (!faculty) {
        throw new NotFoundException(`Faculty with id ${faculty_id} not found`);
      }
      application.faculty = faculty;
    }
    if (allotment_id) {
      const allotment = await this.allotmentRepository.findOneBy({ allotment_id });
      if (!allotment) {
        throw new NotFoundException(`Allotment with id ${allotment_id} not found`);
      }
      application.allotment = allotment;
    }
    if (approved_by) {
      const administrator = await this.administratorRepository.findOneBy({ admin_id: approved_by });
      if (!administrator) {
        throw new NotFoundException(`Administrator with id ${approved_by} not found`);
      }
      application.approvedBy = administrator;
    }

    Object.assign(application, rest);

    return this.applicationRepository.save(application);
  }

  async remove(leave_id: number) {
    const res = await this.applicationRepository.delete(leave_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `application with application id ${leave_id} not found`,
      );
    }
    return {
      message: `application with id ${leave_id} successfully removed from database`,
    };
  }
}
