import { Test } from '@nestjs/testing';
import { JwtHelper } from './jwt';
import { IJwtPayload } from './interfaces/jwt.interface';

describe('Token 모듈 테스트', () => {
  describe('JwtHelper 테스트', () => {
    let jwtHelper: JwtHelper;
    let isFirstTestcase = true;

    async function createJwtHelper() {
      const module = await Test.createTestingModule({
        providers: [JwtHelper]
      }).compile();

      return module.get<JwtHelper>(JwtHelper);
    }

    beforeEach(async () => {
      if (isFirstTestcase) {
        isFirstTestcase = false;
        return;
      }

      process.env.JWT_SECRET = '12345';
      jwtHelper = await createJwtHelper();
    });

    describe('생성자 호출', () => {
      it('환경변수 JWT_SECRET이 정의되어 있지 않으면 예외를 던진다', async () => {
        await expect(createJwtHelper()).rejects.toThrowError();
      });

      it('환경변수 JWT_SECRET이 정의되어 있으면 객체를 반환한다.', async () => {
        process.env.JWT_SECRET = 'secret';
        const obj = await createJwtHelper();
        expect(obj instanceof JwtHelper).toBeTruthy();
        delete process.env.JWT_SECRET;
      });
    });

    describe('encode', () => {
      it('토큰은 JWT 형식이어야하고 반환된 페이로드는 파라미터로 전달한 것과 값이 동일해야한다', async () => {
        const originalPayload = {
          exp: 0,
          sub: 0
        };

        const { payload, token } = await jwtHelper.encode(originalPayload);

        expect(payload).toEqual(originalPayload);
        expect(token.length).toBeGreaterThan(40);
        expect(token.split('.').length).toBe(3);
      });
    });

    describe('verify', () => {
      it('비정상적인 토큰을 전달하면 undefined를 반환한다', () => {
        const result = jwtHelper.verify('Invalid Token');
        expect(result).toBeUndefined();
      });

      it('정상적인 토큰을 전달하면 디코딩 된 페이로드를 반환한다', () => {
        const payload: IJwtPayload = {
          exp: 2523014823,
          sub: 0
        };

        // https://jwt.io/ 에서 생성한 토큰
        const presignedToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI1MjMwMTQ4MjMsInN1YiI6MH0.aLpHW2EHwM6zYToEHSRpRYrEl7YVi6DWh7Syppa-zfY';

        const result = jwtHelper.verify(presignedToken);
        expect(result).toEqual(payload);
      });
    });
  });
});
