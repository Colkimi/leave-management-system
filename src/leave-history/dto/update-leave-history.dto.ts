import { PartialType } from '@nestjs/swagger';
import { CreateLeaveHistoryDto } from './create-leave-history.dto';
import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLeaveHistoryDto extends PartialType(CreateLeaveHistoryDto) {
  @ApiPropertyOptional({
    description: 'leave history identity no.',
    example: '10',
  })
  @IsNumber()
  @IsOptional()
  history_id?: number;

  @ApiPropertyOptional({
    description: 'faculty id attached to the leave',
    example: '101',
  })
  @IsNumber()
  @IsOptional()
  faculty_id?: number;

  @ApiPropertyOptional({
    description: 'identity number of the leave',
    example: '10',
  })
  @IsNumber()
  @IsOptional()
  leave_id?: number;

  @ApiPropertyOptional({
    description: 'type of leave',
    example: 'casual',
  })
  @IsString()
  @IsOptional()
  leave_type?: string;

  @ApiPropertyOptional({
    description: 'start date of the leave',
    example: '2025-10-10',
  })
  @IsDateString()
  @IsOptional()
  start_date?: Date;

  @ApiPropertyOptional({
    description: 'end date of the leave',
    example: '2025-20-10',
  })
  @IsDateString()
  @IsOptional()
  end_date?: Date;

  @ApiPropertyOptional({
    description: 'leave status',
    example: 'approved',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'date the leave history was last updated',
    example: '2024-10-10',
  })
  @IsDateString()
  @IsOptional()
  created_at?: Date;
}
