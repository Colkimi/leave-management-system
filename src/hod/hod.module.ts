import { Module } from '@nestjs/common';
import { HodService } from './hod.service';
import { HodController } from './hod.controller';
import { FacultyModule } from 'src/faculty/faculty.module';
import { DepartmentModule } from 'src/department/department.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { Hod } from './entities/hod.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/profiles/entities/profile.entity';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        ttl: 30, // seconds
      }),
    }),
    FacultyModule,
    DepartmentModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Hod,User]),
    AuthModule,
  ],
  controllers: [HodController],
  providers: [HodService],
  exports: [HodService],
})
export class HodModule {}
