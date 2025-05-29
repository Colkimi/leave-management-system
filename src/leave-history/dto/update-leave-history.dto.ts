import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveHistoryDto } from './create-leave-history.dto';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class UpdateLeaveHistoryDto extends PartialType(CreateLeaveHistoryDto) {}
