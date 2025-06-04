import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCacheDto {
  @ApiProperty({
    description: 'The key for the cache entry',
    example: 'user_123',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'The value to be cached',
    example: 'John Doe Profile Data',
  })
  @IsString()
  value: string;

  @ApiPropertyOptional({
    description: 'Time to live in seconds (optional)',
    example: 50,
  })
  @IsInt()
  @IsOptional()
  ttl?: number; // Time to live in seconds, optional
}
