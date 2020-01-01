import { Test } from '@nestjs/testing';
import { S3 } from 'aws-sdk';
import { S3Service } from './s3.service';

describe('S3 Service', () => {
  let s3Service: S3Service;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [S3Service]
    }).compile();

    s3Service = module.get<S3Service>(S3Service);
  });

  describe('Dependency Injection', () => {
    it('s3Service는 undefined가 아니어야한다', () => {
      expect(s3Service).not.toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('환경변수 AWS_ACCESS_KEY_ID가 정의되어있지 않으면 예외를 던진다', () => {
      const backup = process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_ACCESS_KEY_ID;
      expect(() => new S3Service()).toThrow();
      process.env.AWS_ACCESS_KEY_ID = backup;
    });

    it('환경변수 AWS_SECRET_ACCESS_KEY가 정의되어있지 않으면 예외를 던진다', () => {
      const backup = process.env.AWS_SECRET_ACCESS_KEY;
      delete process.env.AWS_SECRET_ACCESS_KEY;
      expect(() => new S3Service()).toThrowError();
      process.env.AWS_SECRET_ACCESS_KEY = backup;
    });
  });

  describe('getSignedUrl', () => {
    const originalGetSignedUrlPromise = S3.prototype.getSignedUrlPromise;

    beforeEach(() => {
      S3.prototype.getSignedUrlPromise = jest.fn(() => {
        return Promise.resolve('signedUrl');
      });
    });

    afterEach(() => {
      S3.prototype.getSignedUrlPromise = originalGetSignedUrlPromise;
    });

    it('S3 인스턴스의 getSignedUrlPromise를 호출하고 반환 값을 그대로 반환한다', async () => {
      const key = 'path/to/object';
      const signedUrl = await s3Service.getSignedUrl(key);
      expect(S3.prototype.getSignedUrlPromise).toBeCalledTimes(1);
      expect(signedUrl).toBe('signedUrl');
    });
  });

  describe('uploadObjectFromUrl', () => {
    it('올바른 url을 전달하면 저장 path를 반환한다', async () => {
      const url = 'http://www.google.com/favicon.ico';
      const path = 'test/test.jpeg';
      const result = await s3Service.uploadObjectFromUrl(url, path);

      expect(result).toBe(path);
    });

    it('존재하지 않는 url이 전달될 경우 예외를 던진다', async () => {
      expect(
        s3Service.uploadObjectFromUrl(
          'https://invalid.url.invalid-urlinvalid-urlinvalid-urlinvalid-urlinvalid-urlinvalid-url.com',
          'file/path'
        )
      ).rejects.toThrow();
    });
  });

  describe('objectPathResolver', () => {
    describe('getTravelRoomCoverImageUrl', () => {
      it('반환 값은 파라미터로 전달한 travelRoomId 값과 디폴트 확장자인 jpeg를 포함해야한다', () => {
        const travelRoomId = 'd183hrv091hv019hv092hrv0129';
        const path = s3Service.objectPathResolver.getTravelRoomCoverImagePath(
          travelRoomId
        );

        expect(path.includes(`${travelRoomId}.jpeg`)).toBeTruthy();
      });

      it('확장자를 명시할 경우 반환 값의 path 속성은 해당 확장자를 포함한다', () => {
        const travelRoomId = 'd183hrv091hv019hv092hrv0129';
        const path = s3Service.objectPathResolver.getTravelRoomCoverImagePath(
          travelRoomId,
          'tiff'
        );

        expect(path.includes(`${travelRoomId}.tiff`)).toBeTruthy();
      });
    });
  });
});
