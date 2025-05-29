import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  IsDate,
} from 'class-validator';
export class CreateFacultyDto {
 
  @IsNumber()
  @IsOptional()
  faculty_id: number;
  
  @IsString()
  faculty_name: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  @IsOptional()
  department_id: number;

  @IsNumber()
  @IsOptional()
  designation_id: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsDate()
  created_at?: Date;
}
