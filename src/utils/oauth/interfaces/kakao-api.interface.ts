/* eslint-disable camelcase */

export interface KakaoTokenInfo {
  id: string;
  expiresInMillis: number;
  appId: number;
}

export interface KakaoUser {
  id: number;
  kakao_account: {
    profile: {
      nickname: string;
      profile_image_url?: string;
      thumbnail_image?: string;
    };
  };
}

export enum UserProperties {
  PROPERTIES_NICKNAME = 'properties.nickname',
  PROPERTIES_PROFILE_IMAGE = 'properties.profile_image',
  PROPERTIES_THUMBNAIL_IMAGE = 'properties.thumbnail_image',
  KAKAO_ACCOUNT_PROFILE = 'kakao_account.profile',
  KAKAO_ACCOUNT_EMAIL = 'kakao_account.email',
  KAKAO_ACCOUNT_AGE_RANGE = 'kakao_account.age_range',
  KAKAO_ACCOUNT_BIRTHDAY = 'kakao_account.birthday',
  KAKAO_ACCOUNT_GENDER = 'kakao_account.gender'
}
