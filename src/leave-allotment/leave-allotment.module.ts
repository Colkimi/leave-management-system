import { Module } from '@nestjs/common';
import { LeaveAllotmentService } from './leave-allotment.service';
import { LeaveAllotmentController } from './leave-allotment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allotment } from './entities/leave-allotment.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Allotment])],
  controllers: [LeaveAllotmentController],
  providers: [LeaveAllotmentService],
})
export class LeaveAllotmentModule {}
