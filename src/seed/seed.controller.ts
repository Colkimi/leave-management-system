import { Controller, Post, HttpStatus, HttpCode, Logger } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seeding database started...');
    return this.seedService.seed();
  }
}
