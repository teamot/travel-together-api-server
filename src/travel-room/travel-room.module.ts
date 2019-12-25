import { Module } from '@nestjs/common';
import { TravelRoomController } from './travel-room.controller';
import { TravelRoomService } from './travel-room.service';

@Module({
  controllers: [TravelRoomController],
  providers: [TravelRoomService]
})
export class TravelRoomModule {}
