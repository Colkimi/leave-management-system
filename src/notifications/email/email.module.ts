import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/profiles/entities/profile.entity';
import { EmailService } from 'src/notifications/email/email.service';
import { LeaveApplicationModule } from 'src/leave-application/leave-application.module';
import { Application } from 'src/leave-application/entities/leave-application.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Application,User]),
    AuthModule,
    forwardRef(() => LeaveApplicationModule)
  ],
  controllers: [],
  providers: [EmailService],
  exports: [ EmailService],
})
export class EmailModule {}
