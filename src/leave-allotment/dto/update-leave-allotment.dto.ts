import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveAllotmentDto } from './create-leave-allotment.dto';
import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateLeaveAllotmentDto extends PartialType(
  CreateLeaveAllotmentDto,
) {}
