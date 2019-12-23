import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  exports: [TypeOrmModule],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
