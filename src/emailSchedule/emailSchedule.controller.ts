
import {
    Body,
    Controller,
    UseGuards,
    Post,
  } from '@nestjs/common';
  import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import EmailSchedulingService from './emailSchedule.service';
import EmailScheduleDto from './emailSchedule.dto';
   
  @Controller('email-scheduling')
  export default class EmailSchedulingController {
    constructor(
      private readonly emailSchedulingService: EmailSchedulingService
    ) {}
   
    @Post('schedule')
    @UseGuards(JwtAuthenticationGuard)
    async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
      this.emailSchedulingService.scheduleEmail(emailSchedule);
    }
  }