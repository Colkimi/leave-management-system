import { PartialType } from '@nestjs/swagger';
import { CreateLeaveAllotmentDto } from './create-leave-allotment.dto';
import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLeaveAllotmentDto extends PartialType(
  CreateLeaveAllotmentDto,
) {
  @ApiPropertyOptional({
    description: 'leave allotment_id',
    example: '204',
  })
  @IsOptional()
  @IsNumber()
  allotment_id?: number;

  @ApiPropertyOptional({
    description: 'id of the faculty attached to the leave',
    example: '101',
  })
  @IsOptional()
  @IsNumber()
  faculty_id?: number;

  @ApiPropertyOptional({
    description: 'type of leave',
    example: 'sicck leave',
  })
  @IsString()
  @IsOptional()
  leave_type?: string;

  @ApiPropertyOptional({
    description: 'days needed for the leave',
    example: '20',
  })
  @IsNumber()
  @IsOptional()
  total_days?: number;

  @ApiPropertyOptional({
    description: 'days remaining for leave to end',
    example: '20',
  })
  @IsNumber()
  @IsOptional()
  remaining_days?: number;
}
