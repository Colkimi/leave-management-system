import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entities/faculty.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Faculty])],
  controllers: [FacultyController],
  providers: [FacultyService],
})
export class FacultyModule {}
