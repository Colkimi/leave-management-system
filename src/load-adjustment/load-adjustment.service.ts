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
import { CreateLoadAdjustmentDto } from './dto/create-load-adjustment.dto';
import { UpdateLoadAdjustmentDto } from './dto/update-load-adjustment.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadAdjustment } from './entities/load-adjustment.entity';
@Injectable()
export class LoadAdjustmentService {
  constructor(
    @InjectRepository(LoadAdjustment)
    private adjustmentRepository: Repository<LoadAdjustment>,
  ) {}

  async create(createLoadAdjustmentDto: CreateLoadAdjustmentDto) {
    await this.adjustmentRepository.findOne({
      where: { adjustment_id: createLoadAdjustmentDto.adjustment_id },
    });
    return this.adjustmentRepository.save(createLoadAdjustmentDto);
  }

  async findall(search?: string) {
    if (search) {
      return this.adjustmentRepository.find({
        where: [
          { adjustment_type: Like(`%${search}%`) },
          { status: Like(`%${search}%`) },
        ],
      });
    }
    return this.adjustmentRepository.find();
  }

  async findone(adjustment_id: number) {
    const adjustment = await this.adjustmentRepository.findOne({
      where: { adjustment_id },
    });
    return adjustment;
  }

  async update(
    adjustment_id: number,
    UpdateLoadAdjustmentDto: UpdateLoadAdjustmentDto,
  ) {
    const adjustment = await this.adjustmentRepository.findOne({
      where: { adjustment_id },
    });
    if (!adjustment) {
      throw new NotFoundException(
        `adjustment with id ${adjustment_id} not found`,
      );
    }
    const adjustment_type =
      UpdateLoadAdjustmentDto.adjustment_type ?? adjustment.adjustment_type;
    const status = UpdateLoadAdjustmentDto.status ?? adjustment.status;
    [adjustment_type, status];
    await this.adjustmentRepository.findOne({ where: { adjustment_id } });
    return this.adjustmentRepository.save(UpdateLoadAdjustmentDto);
  }

  async remove(adjustment_id: number) {
    const res = await this.adjustmentRepository.delete(adjustment_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `adjustment with adjustment id ${adjustment_id} not found`,
      );
    }
    return {
      message: `adjustment with id ${adjustment_id} successfully removed from database`,
    };
  }
}
