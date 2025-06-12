import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsNumber, IsDateString } from 'class-validator';
export class CreateDepartmentDto {
  @IsNumber()
  @IsOptional()
  department_id: number;

  @ApiProperty({
    description: 'The department name',
    example: 'Technical department',
  })
  @IsString()
  department_name: string;

  @ApiPropertyOptional({
    description: 'Date department was created',
    example: '2025-06-11T19:12:42.432Z',
  })
  @IsOptional()
  @IsDateString()
  created_at: Date;
}
