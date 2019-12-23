import { Test } from '@nestjs/testing';
import { KakaoApi } from './kakao-api';

describe('KakaoApi', () => {
  let kakaoApi: KakaoApi;

  async function createKakaoApi() {
    const module = await Test.createTestingModule({
      providers: [KakaoApi]
    }).compile();

    return module.get<KakaoApi>(KakaoApi);
  }

  beforeEach(async () => {
    kakaoApi = await createKakaoApi();
  });

  describe('토큰 정보 조회', () => {
    it('비정상적인 토큰을 전달하면 undefined를 반환한다.', async () => {
      const result = await kakaoApi.getTokenInfo('Invalid Token');
      expect(result).toBeUndefined();
    });
  });

  describe('유저 정보 조회', () => {
    it('유효하지 않은 파라미터를 전달하면 undefined를 반환한다.', async () => {
      const result = await kakaoApi.getUser(12345, 'Invalid Token');
      expect(result).toBeUndefined();
    });
  });
});
