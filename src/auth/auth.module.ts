import { Module } from '@nestjs/common';
import { OAuthModule } from '../utils/oauth/oauth.module';
import { AccountModule } from '../account/account.module';
import { TokenModule } from '../utils/token/token.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AWSModule } from '../aws/aws.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [OAuthModule, TokenModule, AccountModule, AWSModule]
})
export class AuthModule {}
