import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';
export class CreateAdministratorDto {
  @ApiPropertyOptional({
      description: 'The id for the admin entry',
      example: '3',
    })
  @IsNumber()
  @IsOptional()
  admin_id?: number;

  @ApiProperty({
      description: 'The username for the admin',
      example: 'mibey',
    })
  @IsString()
  username: string;

  @ApiProperty({
      description: 'The password for the admin entry',
      example: '**********',
    })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
      description: 'The email for the admin',
      example: 'admin@example.com',
    })
  @IsEmail()
  email: string;

  @ApiProperty({
      description: 'The admin role',
      example: 'system admin',
    })
  @IsString()
  role: string;

  @IsDate()
  @IsOptional()
  last_login?: Date;
}
