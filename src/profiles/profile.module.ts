import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/profile.entity';
import { RolesGuard } from 'src/auth/guards';
import { AdministratorModule } from 'src/administrator/administrator.module';

@Module({
  imports: [DatabaseModule,AdministratorModule, TypeOrmModule.forFeature([User])],
  controllers: [ProfilesController],
  providers: [ProfilesService, RolesGuard],
})
export class ProfileModule { }
