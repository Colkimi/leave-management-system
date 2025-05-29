import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
} from 'class-validator';
export class CreateAdministratorDto {
  @IsNumber()
  @IsOptional()
  admin_id?: number;

  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
  @IsOptional()
  @IsDate()
  last_login: Date;
}
