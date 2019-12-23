import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokenData } from './interfaces/auth.interface';
import { OAuthLoginOptions } from './auth.dto';
import { KakaoApi } from '../utils/oauth/kakao-api';
import { Account } from '../account/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenGenerator } from '../utils/token/refresh-token';
import { JwtHelper } from '../utils/token/jwt';

@Injectable()
export class AuthService {
  public readonly expIn: number = 15 * 60; // in seconds

  constructor(
    private readonly kakaoApi: KakaoApi,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly jwtHelper: JwtHelper,
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>
  ) {}

  public async getTokensByOAuth(
    oauthLoginOptions: OAuthLoginOptions
  ): Promise<ITokenData> {
    const { oauthId, oauthToken } = oauthLoginOptions;

    const user = await this.kakaoApi.getUser(oauthId, oauthToken);
    if (!user || oauthId !== user.id + '') {
      throw new UnauthorizedException('로그인 정보가 올바르지 않습니다.');
    }

    let account = await this.accountRepo.findOne({ where: { oauthId } });
    if (!account) {
      const newAccount = this.accountRepo.create();
      newAccount.name = user.kakao_account.profile.nickname;
      newAccount.oauthId = user.id + '';
      newAccount.profileImageUrl = user.kakao_account.profile.profile_image_url;
      newAccount.refreshToken = this.refreshTokenGenerator.generate();
      account = await newAccount.save();
    }

    const encoded = await this.jwtHelper.encode({
      exp: this.jwtHelper.generateExp(this.expIn),
      sub: account.id
    });

    return { ...encoded, refreshToken: account.refreshToken };
  }
}
