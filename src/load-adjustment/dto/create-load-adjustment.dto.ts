import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
export class CreateLoadAdjustmentDto {
  @IsOptional()
  adjustment_id?: number;

  @IsNumber()
  faculty_id: number;

  @IsDateString()
  adjustment_date: Date;

  @IsString()
  adjustment_type: string;

  @IsNumber()
  adjustment_hours: number;

  @IsString()
  status: string;
}
