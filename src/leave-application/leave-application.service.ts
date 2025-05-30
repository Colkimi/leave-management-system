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
@Injectable()
export class LeaveApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(createLeaveApplicationDto: CreateLeaveApplicationDto) {
    await this.applicationRepository.findOne({
      where: { leave_id: createLeaveApplicationDto.leave_id },
    });
    return this.applicationRepository.save(createLeaveApplicationDto);
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
    UpdateLeaveApplicationDto: UpdateLeaveApplicationDto,
  ) {
    const application = await this.applicationRepository.findOne({
      where: { leave_id },
    });
    if (!application) {
      throw new NotFoundException(`application with id ${leave_id} not found`);
    }
    const leave_type =
      UpdateLeaveApplicationDto.leave_type ?? application.leave_type;
    const start_date =
      UpdateLeaveApplicationDto.start_date ?? application.start_date;
    const end_date = UpdateLeaveApplicationDto.end_date ?? application.end_date;
    const status = UpdateLeaveApplicationDto.status ?? application.status;
    const reason = UpdateLeaveApplicationDto.reason ?? application.reason;
    [leave_type, start_date, end_date, status, reason];
    await this.applicationRepository.findOne({ where: { leave_id } });
    return this.applicationRepository.save(UpdateLeaveApplicationDto);
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
