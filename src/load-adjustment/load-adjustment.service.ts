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
} from '@nestjs/common';
import { CreateLoadAdjustmentDto } from './dto/create-load-adjustment.dto';
import { UpdateLoadAdjustmentDto } from './dto/update-load-adjustment.dto';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoadAdjustment } from './entities/load-adjustment.entity';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class LoadAdjustmentService {
  constructor(
    @InjectRepository(LoadAdjustment)
    private adjustmentRepository: Repository<LoadAdjustment>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createLoadAdjustmentDto: CreateLoadAdjustmentDto) {
    await this.adjustmentRepository.findOne({
      where: { adjustment_id: createLoadAdjustmentDto.adjustment_id },
    });
    const savedAdjustment = await this.adjustmentRepository.save(
      createLoadAdjustmentDto,
    );
    await this.cacheManager.del('load_adjustments_all');
    return savedAdjustment;
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

    const cached = await this.cacheManager.get<LoadAdjustment[]>(
      'load_adjustments_all',
    );
    if (cached) {
      return cached;
    }

    const adjustments = await this.adjustmentRepository.find();
    await this.cacheManager.set('load_adjustments_all', adjustments);
    return adjustments;
  }

  async findone(adjustment_id: number) {
    const cacheKey = `load_adjustment_${adjustment_id}`;
    const cached = await this.cacheManager.get<LoadAdjustment>(cacheKey);
    if (cached) {
      return cached;
    }

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
    const updatedAdjustment = await this.adjustmentRepository.save(
      UpdateLoadAdjustmentDto,
    );

    await this.cacheManager.del('load_adjustments_all');
    await this.cacheManager.del(`load_adjustment_${adjustment_id}`);
    return updatedAdjustment;
  }

  async remove(adjustment_id: number) {
    const res = await this.adjustmentRepository.delete(adjustment_id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `adjustment with adjustment id ${adjustment_id} not found`,
      );
    }

    await this.cacheManager.del('load_adjustments_all');
    await this.cacheManager.del(`load_adjustment_${adjustment_id}`);
    return {
      message: `adjustment with id ${adjustment_id} successfully removed from database`,
    };
  }
}
