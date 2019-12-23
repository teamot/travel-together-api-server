import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>
  ) {}

  public async getProfile(accountId: string): Promise<Partial<Account>> {
    const account = await this.accountRepo.findOne(accountId);
    if (!account) {
      throw new NotFoundException('요청한 계정 정보가 존재하지 않습니다.');
    }

    return {
      id: account.id,
      name: account.name,
      profileImageUrl: account.profileImageUrl,
      statusMessage: account.statusMessage
    };
  }
}
