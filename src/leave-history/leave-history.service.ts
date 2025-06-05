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
import { CreateLeaveHistoryDto } from './dto/create-leave-history.dto';
import { UpdateLeaveHistoryDto } from './dto/update-leave-history.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from './entities/leave-history.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
@Injectable()
export class LeaveHistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,

    @InjectRepository(Faculty)
    private facultyRepository: Repository<Faculty>,

    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async create(createLeaveHistoryDto: CreateLeaveHistoryDto) {
    const { faculty_id, leave_id, ...rest } = createLeaveHistoryDto;

    const faculty = await this.facultyRepository.findOneBy({ faculty_id });
    if (!faculty) {
      throw new NotFoundException(`Faculty with id ${faculty_id} not found`);
    }

    const application = await this.applicationRepository.findOneBy({ leave_id });
    if (!application) {
      throw new NotFoundException(`Application with id ${leave_id} not found`);
    }

    const history = this.historyRepository.create({
      ...rest,
      faculty,
      application,
    });

    return this.historyRepository.save(history);
  }

  async findall(search?: string) {
    if (search) {
      return this.historyRepository.find({
        where: [
          { leave_type: Like(`%${search}%`) },
          { status: Like(`%${search}%`) },
        ],
      });
    }
    return this.historyRepository.find();
  }

  async findone(history_id: number) {
    const history = await this.historyRepository.findOne({
      where: { history_id },
    });
    return history;
  }

  async update(
    history_id: number,
    updateLeaveHistoryDto: UpdateLeaveHistoryDto,
  ) {
    const history = await this.historyRepository.findOne({
      where: { history_id },
    });
    if (!history) {
      throw new NotFoundException(`history with id ${history_id} not found`);
    }

    const { faculty_id, leave_id, ...rest } = updateLeaveHistoryDto;

    if (faculty_id) {
      const faculty = await this.facultyRepository.findOneBy({ faculty_id });
      if (!faculty) {
        throw new NotFoundException(`Faculty with id ${faculty_id} not found`);
      }
      history.faculty = faculty;
    }
    if (leave_id) {
      const application = await this.applicationRepository.findOneBy({ leave_id });
      if (!application) {
        throw new NotFoundException(`Application with id ${leave_id} not found`);
      }
      history.application = application;
    }

    Object.assign(history, rest);

    return this.historyRepository.save(history);
  }

  async remove(history_id: number) {
    const res = await this.historyRepository.delete(history_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `history with history id ${history_id} not found`,
      );
    }
    return {
      message: `history with id ${history_id} successfully removed from database`,
    };
  }
}
