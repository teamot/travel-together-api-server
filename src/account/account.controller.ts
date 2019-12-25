import { pick } from 'lodash';
import { Controller, Get, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AccountService } from './account.service';
import { GetMeResponse } from './interfaces/account.interface';

@Controller('accounts')
export class AccountController {
  // constructor(private readonly accountService: AccountService) {}
}

@Controller('me')
@UseGuards(AuthGuard)
export class MeController {
  constructor(private readonly accountService: AccountService) {}

  @Get('profile')
  public async getProfile(
    @Body('accountId') accountId: string
  ): Promise<GetMeResponse> {
    const account = await this.accountService.getProfile(accountId);
    return pick(
      account,
      'id',
      'name',
      'profileImageUrl',
      'createdAt',
      'statusMessage'
    );
  }

  @Get('travel-rooms')
  public async getTravelRooms(@Body('accountId') accountId: string) {
    const travelRooms = await this.accountService.getTravelRooms(accountId);
    return travelRooms;
  }
}
