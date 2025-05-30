import { Module } from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';
import { LeaveApplicationController } from './leave-application.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/leave-application.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Application, Faculty, Allotment]),
  ],
  controllers: [LeaveApplicationController],
  providers: [LeaveApplicationService],
})
export class LeaveApplicationModule {}
