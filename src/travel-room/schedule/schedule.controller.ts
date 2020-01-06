import { Controller, Post, UsePipes } from '@nestjs/common';
import { ScheduleValidationPipe } from './schedule-validation.pipe';

@Controller('travel-rooms/:travelRoomId/schedules')
export class ScheduleController {
  @UsePipes(ScheduleValidationPipe)
  @Post()
  async createSchedule() {}
}
