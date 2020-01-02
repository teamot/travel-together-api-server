import { pick } from 'lodash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import {
  CreateTravelRoomDto,
  GetTravelRoomCoverImageUploadUrlDto,
  PatchTravelRoomDto
} from './travel-room.dto';
import { TravelRoom } from './entities/travel-room.entity';
import { S3Service } from '../aws/s3/s3.service';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class TravelRoomService {
  constructor(
    private readonly connection: Connection,
    private readonly s3Service: S3Service
  ) {}

  async getTravelRooms(accountId: string): Promise<TravelRoom[]> {
    const travelRoomIds = (
      await this.connection.getRepository(Account).findOne({
        where: { id: accountId },
        relations: ['joinedTravelRooms']
      })
    )?.joinedTravelRooms.map(travelRoom => travelRoom.id);

    if (!travelRoomIds) {
      return [];
    }

    return this.connection.getRepository(TravelRoom).findByIds(travelRoomIds, {
      relations: ['members', 'countries']
    });
  }

  async createTravelRoom(dto: CreateTravelRoomDto): Promise<TravelRoom> {
    const account = await this.connection
      .getRepository(Account)
      .findOne(dto.accountId);
    if (!account) {
      throw new NotFoundException('유저 정보를 찾을 수 없습니다.');
    }

    const travelRoom = await this.connection
      .getRepository(TravelRoom)
      .create({
        name: dto.name,
        startDate: dto.startDate,
        endDate: dto.endDate
      })
      .save();

    travelRoom.members = [account];
    const promises: Promise<any>[] = [travelRoom.save()];
    if (dto.countries.length > 0) {
      promises.push(
        this.connection
          .createQueryBuilder()
          .relation(TravelRoom, 'countries')
          .of(travelRoom)
          .add(dto.countries)
      );
    }

    await Promise.all(promises);

    return travelRoom;
  }

  async modifyTravelRoom(
    accountId: string,
    travelRoomId: string,
    newValues: PatchTravelRoomDto
  ) {
    const travelRoom = await this.connection
      .getRepository(TravelRoom)
      .findOne(travelRoomId, {
        relations: ['members', 'countries']
      });

    if (!travelRoom) {
      throw new NotFoundException('해당 여행방을 찾을 수 없습니다.');
    }

    const accountIndex = travelRoom.members.findIndex(
      account => account.id === accountId
    );

    if (accountIndex < 0) {
      throw new NotFoundException('해당 여행방을 찾을 수 없습니다.');
    }

    const travelRoomQueryBuilder = this.connection
      .getRepository(TravelRoom)
      .createQueryBuilder();

    const promises: Promise<any>[] = [
      travelRoomQueryBuilder
        .update()
        .set(pick(newValues, ['name', 'startDate', 'endDate']))
        .whereInIds([travelRoom.id])
        .execute()
    ];

    if (newValues.countries) {
      promises.push(
        travelRoomQueryBuilder
          .relation('countries')
          .of(travelRoom)
          .addAndRemove(
            newValues.countries,
            travelRoom.countries.map(country => country.code)
          )
      );
    }

    return Promise.all(promises);
  }

  async leaveTravelRoom(accountId: string, travelRoomId: string) {
    const account = await this.connection
      .getRepository(Account)
      .findOne(accountId);

    if (!account) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }

    return this.connection
      .getRepository(Account)
      .createQueryBuilder()
      .relation('joinedTravelRooms')
      .of(account)
      .remove(travelRoomId);
  }

  async getCoverImageUploadUrl({
    travelRoomId,
    format
  }: GetTravelRoomCoverImageUploadUrlDto): Promise<string> {
    const path = this.s3Service.objectPathResolver.getTravelRoomCoverImagePath(
      travelRoomId,
      format
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

    return signedUrl;
  }
}
