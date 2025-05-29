import { Module } from '@nestjs/common';
import { LeaveHistoryService } from './leave-history.service';
import { LeaveHistoryController } from './leave-history.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './entities/leave-history.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([History])],
  controllers: [LeaveHistoryController],
  providers: [LeaveHistoryService],
})
export class LeaveHistoryModule {}