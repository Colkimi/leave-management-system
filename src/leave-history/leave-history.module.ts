import { Module } from '@nestjs/common';
import { LeaveHistoryService } from './leave-history.service';
import { LeaveHistoryController } from './leave-history.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/leave-history.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([History,Faculty,Application])],
  controllers: [LeaveHistoryController],
  providers: [LeaveHistoryService],
})
export class LeaveHistoryModule {}
