import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
export class CreateLeaveApplicationDto {
  @IsNumber()
  @IsOptional()
  leave_id?: number;

  @IsNumber()
  faculty_id: number;

  @IsString()
  @IsNotEmpty()
  leave_type: string;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsDateString()
  created_at?: Date;
}
