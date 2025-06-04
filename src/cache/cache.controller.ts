import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CreateCacheDto } from './dto/create-cache.dto';
import { CacheService } from './cache.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('cache')
@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {
    console.log('[CacheController] Initialized');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cache entry' })
  @ApiResponse({ status: 201, description: 'Cache entry created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiBody({ type: CreateCacheDto })
  async create(@Body() createCacheDto: CreateCacheDto) {
    return this.cacheService.create(createCacheDto);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Retrieve a cache entry by key' })
  @ApiParam({ name: 'key', description: 'Cache key to retrieve' })
  @ApiResponse({ status: 200, description: 'Cache entry retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Cache entry not found.' })
  async get(@Param('key') key: string) {
    return this.cacheService.get(key);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Remove a cache entry by key' })
  @ApiParam({ name: 'key', description: 'Cache key to remove' })
  @ApiResponse({ status: 200, description: 'Cache entry removed successfully.' })
  @ApiResponse({ status: 404, description: 'Cache entry not found.' })
  async remove(@Param('key') key: string) {
    return this.cacheService.remove(key);
  }
}
