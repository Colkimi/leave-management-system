import { PartialType } from '@nestjs/swagger';
import { CreateLoadAdjustmentDto } from './create-load-adjustment.dto';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateLoadAdjustmentDto extends PartialType(CreateLoadAdjustmentDto) {}
