import { Injectable } from '@nestjs/common';
import request from 'request-promise';
import {
  KakaoTokenInfo,
  KakaoUser,
  UserProperties
} from './interfaces/kakao-api.interface';

@Injectable()
export class KakaoApi {
  private readonly host = 'https://kapi.kakao.com';
  private readonly version = 'v2';
  private readonly prefix = `${this.host}/${this.version}`;

  public async getTokenInfo(
    oauthToken: string
  ): Promise<KakaoTokenInfo | undefined> {
    const uri = `${this.prefix}/user/access_token_info`;
    const method = 'GET';
    const headers = {
      Authorization: `Bearer ${oauthToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    };

    try {
      const result = (await request({
        uri,
        method,
        headers
      })) as KakaoTokenInfo;

      return result;
    } catch (err) {
      console.log(err.error);
      return undefined;
    }
  }

  public async getUser(
    kakaoUserId: string | number,
    kakaoToken: string
  ): Promise<KakaoUser | undefined> {
    try {
      const response = await request({
        uri: `${this.prefix}/user/me`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${kakaoToken}`
        },
        body: JSON.stringify({
          target_id_type: 'user_id',
          target_id: kakaoUserId,
          property_keys: [
            UserProperties.PROPERTIES_NICKNAME,
            UserProperties.PROPERTIES_PROFILE_IMAGE,
            UserProperties.PROPERTIES_THUMBNAIL_IMAGE
          ]
        })
      });

      return JSON.parse(response);
    } catch (err) {
      console.log(err.error);
      return undefined;
    }
  }
}
