import { Module, Global } from '@nestjs/common';
import { JwtHelper } from './jwt';
import { RefreshTokenGenerator } from './refresh-token';

@Global()
@Module({
  providers: [JwtHelper, RefreshTokenGenerator],
  exports: [JwtHelper, RefreshTokenGenerator]
})
export class TokenModule {}
