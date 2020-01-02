import { pick } from 'lodash';
import { Controller, Get, UseGuards, Body, Patch, Query } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AccountService } from './account.service';
import { GetMeResponse } from './interfaces/account.interface';
import { GetSignedUrlResponse } from '../common/response.interface';
import { ModifyProfileDto, GetProfileImageUploadUrlDto } from './account.dto';

@Controller('accounts')
export class AccountController {
  // constructor(private readonly accountService: AccountService) {}
}

@Controller('me')
@UseGuards(AuthGuard)
export class MeController {
  constructor(private readonly accountService: AccountService) {}

  @Get('profile')
  async getProfile(
    @Body('accountId') accountId: string
  ): Promise<GetMeResponse> {
    const account = await this.accountService.getProfile(accountId);
    return pick(
      account,
      'id',
      'name',
      'profileImagePath',
      'createdAt',
      'statusMessage'
    );
  }

  @Patch('profile')
  async modifyProfile(@Body() newValues: ModifyProfileDto): Promise<void> {
    await this.accountService.modifyProfile(newValues);
  }

  @Get('profile-image/upload-url')
  async getProfileImageUploadUrl(
    @Query() dto: GetProfileImageUploadUrlDto,
    @Body('accountId') accountId: string
  ): Promise<GetSignedUrlResponse> {
    const signedUrl = await this.accountService.getProfileImageUploadUrl({
      ...dto,
      accountId
    });
    return { signedUrl };
  }
}
