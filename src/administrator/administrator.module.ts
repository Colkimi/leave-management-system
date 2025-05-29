import { Module } from '@nestjs/common';
import { AdministratorService } from './administrator.service';
import { AdministratorController } from './administrator.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from './entities/administrator.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Administrator])],
  controllers: [AdministratorController],
  providers: [AdministratorService],
})
export class AdministratorModule {}
