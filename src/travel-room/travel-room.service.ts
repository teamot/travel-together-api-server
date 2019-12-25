import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import {
  CreateTravelRoomDto,
  GetTravelRoomCoverImageUploadUrlDto
} from './travel-room.dto';
import { TravelRoom } from './entities/travel-room.entity';
import { S3Service } from '../aws/s3/s3.service';
import { GetSignedUrlResponse } from './interfaces/travel-room.interface';

@Injectable()
export class TravelRoomService {
  constructor(
    private readonly connection: Connection,
    private readonly s3Service: S3Service
  ) {}

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

  async getCoverImageUploadUrl({
    travelRoomId
  }: GetTravelRoomCoverImageUploadUrlDto): Promise<GetSignedUrlResponse> {
    const path = this.s3Service.objectPathResolver.getTravelRoomCoverImagePath(
      travelRoomId
    );

    const [updateResult, signedUrl] = await Promise.all([
      this.connection
        .getRepository(TravelRoom)
        .update({ id: travelRoomId }, { coverImagePath: path }),
      this.s3Service.getSignedUrl(path)
    ]);

    if (!updateResult.affected) {
      throw new NotFoundException(
        '해당 여행방에 대한 업로드 주소를 생성할 수 없습니다.'
      );
    }

    return { signedUrl };
  }
}
