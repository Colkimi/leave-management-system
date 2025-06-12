import { Module } from '@nestjs/common';
import { LoadAdjustmentService } from './load-adjustment.service';
import { LoadAdjustmentController } from './load-adjustment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadAdjustment } from './entities/load-adjustment.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/profiles/entities/profile.entity';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: 30, // seconds
      }),
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([LoadAdjustment, User]),
  ],
  controllers: [LoadAdjustmentController],
  providers: [LoadAdjustmentService],
})
export class LoadAdjustmentModule {}
