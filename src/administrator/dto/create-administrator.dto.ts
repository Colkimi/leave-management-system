import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/profiles/entities/profile.entity';
export class CreateAdministratorDto {
  @IsNumber()
  @IsOptional()
  admin_id?: number;

  @ApiProperty({
    description: 'The username for the admin',
    example: 'mibey',
  })
  @IsString()
  username: string;

  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  last_login?: Date;
}
