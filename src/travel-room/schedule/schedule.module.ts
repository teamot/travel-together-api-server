import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';

@Module({
  controllers: [ScheduleController]
})
export class ScheduleModule {}
