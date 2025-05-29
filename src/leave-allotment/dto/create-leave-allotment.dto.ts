import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
export class CreateLeaveAllotmentDto {
  @IsOptional()
  @IsNumber()
  allotment_id?: number;

  @IsOptional()
  @IsNumber()
  faculty_id?: number;

  @IsString()
  @IsNotEmpty()
  leave_type: string;

  @IsNumber()
  total_days: number;

  @IsNumber()
  remaining_days: number;
}
