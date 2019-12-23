import { Module } from '@nestjs/common';
import { KakaoApi } from './kakao-api';

@Module({
  providers: [KakaoApi],
  exports: [KakaoApi]
})
export class OAuthModule {}
