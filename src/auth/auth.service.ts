import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokenData, IEncodableAccount } from './interfaces/auth.interface';
import { OAuthLoginOptions } from './auth.dto';
import { KakaoApi } from '../utils/oauth/kakao-api';
import { Account } from '../account/entities/account.entity';
import { Connection } from 'typeorm';
import { RefreshTokenGenerator } from '../utils/token/refresh-token';
import { JwtHelper } from '../utils/token/jwt';
import { IJwtEncodeReturn } from '../utils/token/interfaces/jwt.interface';

@Injectable()
export class AuthService {
  readonly expIn: number = 15 * 60; // in seconds

  constructor(
    private readonly kakaoApi: KakaoApi,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly jwtHelper: JwtHelper,
    private readonly connection: Connection
  ) {}

  async getTokensByOAuth(
    oauthLoginOptions: OAuthLoginOptions
  ): Promise<ITokenData> {
    const { oauthId, oauthToken } = oauthLoginOptions;

    const user = await this.kakaoApi.getUser(oauthId, oauthToken);
    if (!user || oauthId !== user.id + '') {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }

    let account = await this.connection.getRepository(Account).findOne({
      where: { oauthId },
      select: ['refreshToken']
    });
    if (!account) {
      const newAccount = this.connection.getRepository(Account).create();
      newAccount.name = user.kakao_account.profile.nickname;
      newAccount.oauthId = user.id + '';
      newAccount.profileImageUrl = user.kakao_account.profile.profile_image_url;
      newAccount.refreshToken = this.refreshTokenGenerator.generate();
      account = await newAccount.save();
    }

    const encoded = await this.issueJwt(account);

    return { ...encoded, refreshToken: account.refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<ITokenData> {
    const account = await this.connection
      .getRepository(Account)
      .findOne({ where: { refreshToken }, select: ['refreshToken'] });

    if (!account) {
      throw new UnauthorizedException('갱신 토큰이 유효하지 않습니다.');
    }

    const encoded = await this.issueJwt(account);
    return { ...encoded, refreshToken: account.refreshToken };
  }

  private issueJwt(account: IEncodableAccount): Promise<IJwtEncodeReturn> {
    return this.jwtHelper.encode({
      exp: this.jwtHelper.generateExp(this.expIn),
      sub: account.id
    });
  }
}
