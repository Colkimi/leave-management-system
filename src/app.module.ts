import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SeedModule } from './seed/seed.module';
import { LogsModule } from './logs/logs.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
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
