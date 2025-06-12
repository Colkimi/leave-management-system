import { Module } from '@nestjs/common';
import { LeaveHistoryService } from './leave-history.service';
import { LeaveHistoryController } from './leave-history.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/leave-history.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
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
    TypeOrmModule.forFeature([History, Faculty, Application, User]),
    AuthModule,
  ],
  controllers: [LeaveHistoryController],
  providers: [LeaveHistoryService],
})
export class LeaveHistoryModule {}
