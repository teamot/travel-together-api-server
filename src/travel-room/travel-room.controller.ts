import { Controller, Post, Body, UseGuards, Query, Get } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateTravelRoomDto,
  GetTravelRoomCoverImageUploadUrlDto
} from './travel-room.dto';
import { TravelRoom } from './entities/travel-room.entity';
import { TravelRoomService } from './travel-room.service';
import { GetSignedUrlResponse } from '../common/response.interface';

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

  @Get('cover-image/upload-url')
  @UseGuards(AuthGuard)
  async getCoverImageUploadUrl(
    @Query() dto: GetTravelRoomCoverImageUploadUrlDto
  ): Promise<GetSignedUrlResponse> {
    return {
      signedUrl: await this.travelRoomService.getCoverImageUploadUrl(dto)
    };
  }
}
