import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsDate,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from 'src/profiles/entities/profile.entity';

export class CreateFacultyDto {
  @ApiPropertyOptional({
    description: 'faculty identity number',
    example: '3',
  })
  @IsNumber()
  @IsOptional()
  faculty_id?: number;

  @ApiProperty({
    description: 'username for authentication',
    example: 'faculty123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'password for authentication',
    example: 'securePassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'name of the faculty',
    example: 'Human resource',
  })
  @IsString()
  @IsNotEmpty()
  faculty_name: string;

  @ApiProperty({
    description: 'your personal phone number',
    example: '+254 (7)12-34-56-78',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'id of the department of the faculty member',
    example: '101',
  })
  @IsNumber()
  department_id: number;

  @ApiProperty({
    description: 'id of the designation of the faculty member',
    example: '101',
  })
  @IsNumber()
  designation_id: number;

  @ApiProperty({
    description: 'activity status',
    example: 'active',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

    @IsString()
    @IsEnum(Role, {
      message:
        'Role must be one of the following: admin, faculty, hod',
    })
    role: Role = Role.FACULTY;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}


