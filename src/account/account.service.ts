import { Injectable, NotFoundException } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Account } from './entities/account.entity';
import { omit } from 'lodash';
import { S3Service } from '../aws/s3/s3.service';
import { GetProfileImageUploadUrlDto, ModifyProfileDto } from './account.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly connection: Connection,
    private readonly s3Service: S3Service
  ) {}

  async getProfile(accountId: string): Promise<Account> {
    const account = await this.connection
      .getRepository(Account)
      .findOne(accountId);
    if (!account) {
      throw new NotFoundException('요청한 계정 정보가 존재하지 않습니다.');
    }

    return account;
  }

  async modifyProfile(newValues: ModifyProfileDto): Promise<Account> {
    const accountToBeUpdated = await this.connection
      .getRepository(Account)
      .findOne(newValues.accountId);

    if (!accountToBeUpdated) {
      throw new NotFoundException(
        '변경하려는 사용자의 프로필 정보를 찾을 수 없습니다.'
      );
    }

    return Object.assign(
      accountToBeUpdated,
      omit(newValues, 'accountId')
    ).save();
  }

  async getProfileImageUploadUrl(
    metadata: GetProfileImageUploadUrlDto & { accountId: string }
  ): Promise<string> {
    const { accountId, format } = metadata;
    const account = await this.connection
      .getRepository(Account)
      .findOne(accountId);
    if (!account) {
      throw new NotFoundException(
        '프로필 사진을 업로드할 유저 정보를 찾을 수 없습니다.'
      );
    }

    const path = this.s3Service.objectPathResolver.getProfileImagePath(
      accountId,
      format
    );

    const promises: [Promise<string>, Promise<Account>] = [
      this.s3Service.getSignedUrl(path),
      Promise.resolve(account)
    ];

    if (account.profileImagePath === path) {
      account.profileImagePath = path;
      promises[1] = account.save();
    }

    const [signedUrl] = await Promise.all(promises);
    return signedUrl;
  }
}
