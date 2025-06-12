import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveHistoryDto {
  @ApiPropertyOptional({
    description: 'leave history identity no.',
    example: '10',
  })
  @IsNumber()
  @IsOptional()
  history_id?: number;

  @ApiProperty({
    description: 'faculty id attached to the leave',
    example: '101',
  })
  @IsNumber()
  faculty_id: number;

  @ApiProperty({
    description: 'identity number of the leave',
    example: '10',
  })
  @IsNumber()
  leave_id: number;

  @ApiProperty({
    description: 'type of leave',
    example: 'casual',
  })
  @IsString()
  @IsNotEmpty()
  leave_type: string;

  @ApiProperty({
    description: 'start date of the leave',
    example: '2025-10-10',
  })
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    description: 'end date of the leave',
    example: '2025-20-10',
  })
  @IsDateString()
  end_date: Date;

  @ApiProperty({
    description: 'leave status',
    example: 'approved',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiPropertyOptional({
    description: 'date the leave history was last updated',
    example: '2024-10-10',
  })
  @IsDateString()
  @IsOptional()
  created_at?: Date;
}
