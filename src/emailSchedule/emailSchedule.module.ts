import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EmailSchedulingService from './emailSchedule.service';
import EmailSchedulingController from './emailSchedule.controller';
import { EmailModule } from 'src/email/email.module';
 
@Module({
  imports: [ConfigModule, EmailModule],
  controllers: [EmailSchedulingController],
  providers: [EmailSchedulingService],
  exports: []
})
export class EmailSheduleModule {}