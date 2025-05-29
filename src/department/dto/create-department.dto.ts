import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
export class CreateDepartmentDto {

  @IsString()
  department_name: string;

  @IsOptional()
  @IsDate()
  created_at: Date;
}
