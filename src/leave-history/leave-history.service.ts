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
@Injectable()
export class LeaveHistoryService {
  constructor(
    @InjectRepository(History)
    private historyRepository: Repository<History>,
  ) {}

  async create(createLeaveHistoryDto: CreateLeaveHistoryDto) {
    await this.historyRepository.findOne({
      where: { history_id: createLeaveHistoryDto.history_id },
    });
    return this.historyRepository.save(createLeaveHistoryDto);
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

  async update(history_id: number, UpdateLeaveHistoryDto: UpdateLeaveHistoryDto) {
    const history = await this.historyRepository.findOne({
      where: { history_id },
    });
    if (!history) {
      throw new NotFoundException(`history with id ${history_id} not found`);
    }
    const leave_type = UpdateLeaveHistoryDto.leave_type ?? history.leave_type;
    const status = UpdateLeaveHistoryDto.status ?? history.status;
    [leave_type, status];
    await this.historyRepository.findOne({ where: { history_id } });
    return this.historyRepository.save(UpdateLeaveHistoryDto);
  }

  async remove(history_id: number) {
    const res = await this.historyRepository.delete(history_id);
    if (res.affected === 0) {
      throw new NotFoundException(`history with history id ${history_id} not found`);
    }
    return {message: `history with id ${history_id} successfully removed from database`};
  }
}
