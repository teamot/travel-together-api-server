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
