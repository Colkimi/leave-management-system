import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Administrator } from 'src/administrator/entities/administrator.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy, RfStrategy } from './strategies';
import { RolesGuard } from './guards/role.guard';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Hod } from 'src/hod/entities/hod.entity';
import { User } from 'src/profiles/entities/profile.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Administrator, Faculty, Hod,User]),
    JwtModule.register({
      global: true,
    }),
    PassportModule,
  ],
  providers: [AuthService, AtStrategy, RfStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [RolesGuard],
})
export class AuthModule {}
