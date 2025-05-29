import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
export class CreateLeaveHistoryDto {
  @IsNumber()
  @IsOptional()
  history_id?: number;

  @IsNumber()
  faculty_id: number;

  @IsString()
  leave_type: string;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsString()
  status: string;

  @IsDateString()
  @IsOptional()
  created_at: Date;
}
