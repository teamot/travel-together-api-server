import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTravelRoomDto } from './interfaces/travel-room.dto';
import { TravelRoom } from './entities/travel-room.entity';
import { TravelRoomService } from './travel-room.service';

@Controller('travel-rooms')
export class TravelRoomController {
  constructor(private readonly travelRoomService: TravelRoomService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createTravelRoom(
    @Body() dto: CreateTravelRoomDto
  ): Promise<TravelRoom> {
    return this.travelRoomService.createTravelRoom(dto);
  }
}
