import { Module, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { RolesGuard } from './auth/guards/role.guard';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger.middleware';
import { AdministratorModule } from './administrator/administrator.module';
import { DepartmentModule } from './department/department.module';
import { DesignationModule } from './designation/designation.module';
import { FacultyModule } from './faculty/faculty.module';
import { LeaveApplicationModule } from './leave-application/leave-application.module';
import { LeaveAllotmentModule } from './leave-allotment/leave-allotment.module';
import { LeaveHistoryModule } from './leave-history/leave-history.module';
import { LoadAdjustmentModule } from './load-adjustment/load-adjustment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module';
import { LogsModule } from './logs/logs.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { HodModule } from './hod/hod.module';
import { ProfileModule } from './profiles/profile.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './notifications/email/email.module';
 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AdministratorModule,
    ProfileModule,
    DepartmentModule,
    DesignationModule,
    FacultyModule,
    SeedModule,
    LeaveApplicationModule,
    LeaveAllotmentModule,
    LeaveHistoryModule,
    LoadAdjustmentModule,
    HodModule,
    DatabaseModule,
    LogsModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 60000, // 60 sec: Cache time-to-live
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
            }),
            createKeyv(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),
    AuthModule,
    HodModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    EmailModule,
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor, // Global cache interceptor to cache responses
    },
    {
      provide: APP_GUARD,
      useClass: AtGuard, // Global guard to protect routes
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],

  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        'user',
        'administrator',
        'department',
        'designation',
        'faculty',
        'leave-allotment',
        'leave-application',
        'leave-history',
        'load-adjustment',
        'hod',
      );
  }
}
