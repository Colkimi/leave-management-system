import { PartialType } from '@nestjs/mapped-types';
import { CreateDesignationDto } from './create-designation.dto';
import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';

export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {
  @IsOptional()
  @IsNumber()
  designation_id?: number;

  @IsOptional()
  @IsString()
  designation_name?: string;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}
