import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveApplicationDto } from './create-leave-application.dto';
import {
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class UpdateLeaveApplicationDto extends PartialType(
  CreateLeaveApplicationDto,
) {}
