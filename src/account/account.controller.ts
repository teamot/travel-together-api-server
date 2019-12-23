import { Controller, Get, UseGuards, Body } from '@nestjs/common';
// import { AccountService } from './account.service';
import { AuthGuard } from '../auth/auth.guard';
import { AccountService } from './account.service';
import { GetMeResponse } from './interfaces/account.interface';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  public async me(
    @Body('accountId') accountId: string
  ): Promise<GetMeResponse> {
    const account = await this.accountService.getProfile(accountId);
    return account;
  }
}
