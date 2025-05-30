import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { Department } from 'src/department/entities/department.entity';
import { Designation } from 'src/designation/entities/designation.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
import { History } from 'src/leave-history/entities/leave-history.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Administrator,
      Department,
      Designation,
      Faculty,
      Allotment,
      Application,
      History,
      LoadAdjustment,
    ]),
  ],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedModule {}
