import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
export class CreateDesignationDto {
  @IsString()
  @IsNotEmpty()
  designation_name: string;

  @IsOptional()
  @IsString()
  created_at?: Date;
}
