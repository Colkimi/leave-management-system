import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateDesignationDto {
  @IsOptional()
  @IsNumber()
  designation_id?: number;

  @ApiProperty({
    description: 'designation of faculty member',
    example: 'coordinator',
  })
  @IsString()
  @IsNotEmpty()
  designation_name: string;

  @ApiPropertyOptional({
    description: 'time the designation was allocated',
    example: '2024-10-10',
  })
  @IsOptional()
  @IsString()
  created_at?: Date;
}
