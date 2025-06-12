import { IsString, IsNotEmpty, IsEmail, IsEnum } from 'class-validator';
import { Role } from '../entities/profile.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
      description: 'first name of the user',
      example: 'Faculty',
    })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'last name of the user',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'work email address of the user',
    example: 'faculty@ourcompany.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password of the user',
    example: 'faculty123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'role of the user',
    example: 'faculty',
  })
  @IsString()
  @IsEnum(Role, {
    message:
      'Role must be one of the following: admin, faculty,hod ',
  })
  role: Role = Role.FACULTY; 
}
