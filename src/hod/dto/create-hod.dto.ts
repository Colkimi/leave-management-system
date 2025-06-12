import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from 'src/profiles/entities/profile.entity';

export class CreateHodDto {

    @IsNumber()
    @IsOptional()
    hod_id?: number;

  @ApiProperty({
    description: 'username of the hod',
    example: 'hodname',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'faculty_id of the hod',
    example: '1',
  })
  @IsNotEmpty()
  faculty_id: number;

  @ApiProperty({
    description: 'department id of the hod',
    example: '2',
  })
  @IsNotEmpty()
  department_id: number;
}
