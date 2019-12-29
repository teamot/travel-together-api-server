import { Module } from '@nestjs/common';
import { AccountController, MeController } from './account.controller';
import { AccountService } from './account.service';
import { AWSModule } from '../aws/aws.module';

@Module({
  imports: [AWSModule],
  controllers: [AccountController, MeController],
  providers: [AccountService]
})
export class AccountModule {}
