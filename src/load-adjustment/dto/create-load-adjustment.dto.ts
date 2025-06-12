import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLoadAdjustmentDto {

  @IsOptional()
  adjustment_id?: number;

  @ApiProperty({
    description: 'date the adjustment is made',
    example: '2025-06-11T18:28:47.537Z',
  })
  @IsDateString()
  adjustment_date: Date;

  @ApiProperty({
    description: 'type of adjustment',
    example: 'increase',
  })
  @IsString()
  adjustment_type: string;

  @ApiProperty({
    description: 'number of hours leave is adjusted',
    example: '24',
  })
  @IsNumber()
  adjustment_hours: number;

  @ApiProperty({
    description: 'status of the adjustment',
    example: 'pending',
  })
  @IsString()
  status: string;
}
