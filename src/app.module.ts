import { Module, NestModule, MiddlewareConsumer, Inject } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { CacheModule as CustomCacheModule } from './cache/cache.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AdministratorModule,
    DepartmentModule,
    DesignationModule,
    FacultyModule,
    SeedModule,
    LeaveApplicationModule,
    LeaveAllotmentModule,
    LeaveHistoryModule,
    LoadAdjustmentModule,
    DatabaseModule,
    LogsModule,
    CacheModule.registerAsync({
      imports: [ ConfigModule],
      inject: [ ConfigService],
      isGlobal: true,
      useFactory: ( configService: ConfigService)=>{
        return{
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
                }),
            createKeyv(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),
    CustomCacheModule,
  ],
    providers: [AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor, // Global cache interceptor
    },
  ],

  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        'administrator',
        'department',
        'designation',
        'faculty',
        'leave-allotment',
        'leave-application',
        'leave-history',
        'load-adjustment',
      );
  }
}
