import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CreateTravelRoomDto } from './interfaces/travel-room.dto';
import { TravelRoom } from './entities/travel-room.entity';

@Injectable()
export class TravelRoomService {
  constructor(private readonly connection: Connection) {}

  async createTravelRoom(dto: CreateTravelRoomDto): Promise<TravelRoom> {
    const travelRoom = await this.connection
      .getRepository(TravelRoom)
      .create({
        name: dto.name,
        startDate: dto.startDate,
        endDate: dto.endDate
      })
      .save();

    const promises = [];
    if (dto.countries) {
      promises.push(
        this.connection
          .createQueryBuilder()
          .relation(TravelRoom, 'countries')
          .of(travelRoom)
          .add(dto.countries)
      );
    }

    promises.push(
      this.connection
        .createQueryBuilder()
        .relation(TravelRoom, 'members')
        .of(travelRoom)
        .add(dto.accountId)
    );

    await Promise.all(promises);

    return travelRoom;
  }
}
