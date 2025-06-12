import { PartialType } from '@nestjs/swagger';
import { CreateDesignationDto } from './create-designation.dto';
import { IsOptional, IsString, IsDate, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDesignationDto extends PartialType(CreateDesignationDto) {}
