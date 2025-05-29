import { PartialType } from '@nestjs/mapped-types';
import { CreateAdministratorDto } from './create-administrator.dto';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsDate,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class UpdateAdministratorDto extends PartialType(
  CreateAdministratorDto,
) {
  @IsNumber()
  @IsOptional()
  admin_id?: number;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsDate()
  @IsOptional()
  last_login: Date;
}
