import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { CreateCacheDto } from './dto/create-cache.dto';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {
   console.log('[CacheController] Initialized');
  }
  @Post()
  async create(@Body() createCacheDto: CreateCacheDto) {
    return this.cacheService.create(createCacheDto);
  }

  @Get(':key')
  async get(@Param('key') key: string) {
    return this.cacheService.get(key);
  }

  @Delete(':key')
  async remove(@Param('key') key: string) {
    return this.cacheService.remove(key);
  }
}