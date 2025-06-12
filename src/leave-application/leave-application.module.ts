import { forwardRef, Module } from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';
import { LeaveApplicationController } from './leave-application.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/leave-application.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/profiles/entities/profile.entity';
import { EmailService } from 'src/notifications/email/email.service';
import { EmailModule } from 'src/notifications/email/email.module';

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
    TypeOrmModule.forFeature([Application, Faculty, Allotment, Administrator, User,EmailService]),
    AuthModule,
    forwardRef(() => EmailModule),
  ],
  controllers: [LeaveApplicationController],
  providers: [LeaveApplicationService],
})
export class LeaveApplicationModule {}
