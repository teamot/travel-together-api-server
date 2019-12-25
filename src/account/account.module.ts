import { Module } from '@nestjs/common';
import { AccountController, MeController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController, MeController],
  providers: [AccountService]
})
export class AccountModule {}
