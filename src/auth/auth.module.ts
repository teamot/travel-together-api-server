import { Module } from '@nestjs/common';
import { OAuthModule } from '../utils/oauth/oauth.module';
import { AccountModule } from '../account/account.module';
import { TokenModule } from '../utils/token/token.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [OAuthModule, TokenModule, AccountModule]
})
export class AuthModule {}
