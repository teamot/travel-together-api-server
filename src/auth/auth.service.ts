import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokenData, IEncodableAccount } from './interfaces/auth.interface';
import { OAuthLoginOptions } from './auth.dto';
import { KakaoApi } from '../utils/oauth/kakao-api';
import { Account } from '../account/entities/account.entity';
import { Connection } from 'typeorm';
import { RefreshTokenGenerator } from '../utils/token/refresh-token';
import { JwtHelper } from '../utils/token/jwt';
import { IJwtEncodeReturn } from '../utils/token/interfaces/jwt.interface';
import { S3Service } from '../aws/s3/s3.service';
import { ImageFormat } from '../common/format';

@Injectable()
export class AuthService {
  readonly expIn: number = 7 * 24 * 60 * 60; // in seconds

  constructor(
    private readonly kakaoApi: KakaoApi,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly jwtHelper: JwtHelper,
    private readonly connection: Connection,
    private readonly s3Service: S3Service
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
      select: ['id', 'refreshToken']
    });

    if (!account) {
      const newAccount = this.connection.getRepository(Account).create();

      newAccount.name = user.kakao_account.profile.nickname;
      newAccount.oauthId = user.id + '';
      newAccount.refreshToken = this.refreshTokenGenerator.generate();
      account = await newAccount.save();

      const profileImageSrcUrl = user.kakao_account.profile.profile_image_url;
      if (profileImageSrcUrl) {
        const profileImagePath = this.s3Service.objectPathResolver.getProfileImagePath(
          account.id,
          ImageFormat.JPEG
        );

        account.profileImagePath = profileImagePath;
        await Promise.all([
          this.s3Service.uploadObjectFromUrl(
            profileImageSrcUrl,
            profileImagePath
          ),
          account.save()
        ]);
      }
    }

    const encoded = await this.issueJwt(account);

    return { ...encoded, refreshToken: account.refreshToken };
  }

  async uploadProfileImageFromUrl(
    accountId: string,
    url: string,
    format: ImageFormat
  ): Promise<string> {
    const profileImagePath = this.s3Service.objectPathResolver.getProfileImagePath(
      accountId,
      format
    );

    return this.s3Service.uploadObjectFromUrl(url, profileImagePath);
  }

  async refreshToken(refreshToken: string): Promise<ITokenData> {
    const account = await this.connection
      .getRepository(Account)
      .findOne({ where: { refreshToken }, select: ['id', 'refreshToken'] });

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
