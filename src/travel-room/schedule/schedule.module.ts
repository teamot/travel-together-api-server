import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleValidationPipe } from './schedule-validation.pipe';

@Module({
  controllers: [ScheduleController],
  providers: [ScheduleValidationPipe]
})
export class ScheduleModule {}
