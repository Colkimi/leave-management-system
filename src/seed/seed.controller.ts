import { Controller, Post, HttpStatus, HttpCode, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  constructor(private readonly seedService: SeedService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seeding database started...');
    return this.seedService.seed();
  }
}
