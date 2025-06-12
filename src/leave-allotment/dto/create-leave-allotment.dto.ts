import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveAllotmentDto {
  
  @IsOptional()
  @IsNumber()
  allotment_id?: number;

  @ApiProperty({
    description: 'id of the faculty attached to the leave',
    example: '101',
  })
  @IsNumber()
  faculty_id: number;

  @ApiProperty({
    description: 'type of leave',
    example: 'sicck leave',
  })
  @IsString()
  @IsNotEmpty()
  leave_type: string;

  @ApiProperty({
    description: 'days needed for the leave',
    example: '20',
  })
  @IsNumber()
  total_days: number;

  @ApiProperty({
    description: 'days remaining for leave to end',
    example: '20',
  })
  @IsNumber()
  remaining_days: number;
}
