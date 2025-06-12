import { Module } from '@nestjs/common';
import { LeaveAllotmentService } from './leave-allotment.service';
import { LeaveAllotmentController } from './leave-allotment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allotment } from './entities/leave-allotment.entity';
import { DatabaseModule } from 'src/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
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
    TypeOrmModule.forFeature([Allotment, User]),
    AuthModule,
  ],
  controllers: [LeaveAllotmentController],
  providers: [LeaveAllotmentService],
})
export class LeaveAllotmentModule {}
