import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveApplicationDto {
  @IsNumber()
  @IsOptional()
  leave_id?: number;

  @ApiProperty({
    description: 'faculty id',
    example: '1',
  })
  @IsNumber()
  faculty_id: number;

  @ApiProperty({
    description: 'allotment id of the leave',
    example: '2',
  })
  @IsNumber()
  allotment_id?: number;

  @ApiProperty({
    description: 'type of leave',
    example: 'casual',
  })
  @IsString()
  @IsNotEmpty()
  leave_type: string;

  @ApiProperty({
    description: 'starting date of the leave',
    example: '2025-06-11T19:12:42.432Z',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'end date of the leave',
    example: '2025-06-11T19:12:42.432Z',
  })
  @IsDateString()
  end_date: Date;

  @ApiPropertyOptional({
    description: 'leave status',
    example: 'pending',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'reason for the leave',
    example: 'going with family for vacation',
  })
  @IsString()
  reason: string;

  @ApiPropertyOptional({
    description: 'Date of the leave application',
    example: '2025-06-11T19:12:42.432Z',
  })
  @IsOptional()
  @IsDateString()
  created_at?: Date;
}
