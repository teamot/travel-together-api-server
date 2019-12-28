import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Account } from './entities/account.entity';
import { TravelRoom } from '../travel-room/entities/travel-room.entity';

@Injectable()
export class AccountService {
  constructor(private readonly connection: Connection) {}

  async getProfile(accountId: string): Promise<Account> {
    const account = await this.connection
      .getRepository(Account)
      .findOne(accountId);
    if (!account) {
      throw new NotFoundException('요청한 계정 정보가 존재하지 않습니다.');
    }

    return account;
  }

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
}
