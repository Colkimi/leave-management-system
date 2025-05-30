import { Module } from '@nestjs/common';
import { LoadAdjustmentService } from './load-adjustment.service';
import { LoadAdjustmentController } from './load-adjustment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadAdjustment } from './entities/load-adjustment.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([LoadAdjustment])],
  controllers: [LoadAdjustmentController],
  providers: [LoadAdjustmentService],
})
export class LoadAdjustmentModule {}
