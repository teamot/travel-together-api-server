import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Patch,
  Param,
  Query
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateTravelRoomDto,
  GetTravelRoomCoverImageUploadUrlDto,
  PatchTravelRoomDto,
  TravelRoomIdDto
} from './travel-room.dto';
import { TravelRoom } from './entities/travel-room.entity';
import { TravelRoomService } from './travel-room.service';
import { GetSignedUrlResponse } from '../common/response.interface';

@Controller('travel-rooms')
export class TravelRoomController {
  constructor(private readonly travelRoomService: TravelRoomService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getTravelRooms(@Body('accountId') accountId: string) {
    const travelRooms = await this.travelRoomService.getTravelRooms(accountId);
    return travelRooms;
  }

  @Post()
  @UseGuards(AuthGuard)
  async createTravelRoom(
    @Body() dto: CreateTravelRoomDto
  ): Promise<TravelRoom> {
    return this.travelRoomService.createTravelRoom(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async modifyTravelRoom(
    @Param() { id }: TravelRoomIdDto,
    @Body() dto: PatchTravelRoomDto
  ) {
    await this.travelRoomService.modifyTravelRoom(dto.accountId, id, dto);
  }

  @Post('/:id/leave')
  @UseGuards(AuthGuard)
  async leaveTravelRoom(
    @Param() { id }: TravelRoomIdDto,
    @Body('accountId') accountId: string
  ) {
    await this.travelRoomService.leaveTravelRoom(accountId, id);
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
