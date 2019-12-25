import { S3 } from 'aws-sdk';
import { S3Config } from './interfaces/s3.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Service {
  public readonly objectPathResolver: ObjectPathResolver;

  private s3: S3;
  private config: S3Config = {
    defaultSignedUrlExpiresIn: 5 * 60, // 5분
    bucketName: 'travel-together2',
    signatureVersion: 'v4',
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };

  constructor() {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      console.log(
        `환경변수 AWS_ACCESS_KEY_ID 또는 AWS_SECRET_ACCESS_KEY가 정의되어있지 않습니다.`
      );
      process.exit(-1);
    }

    this.s3 = new S3(this.config);
    this.objectPathResolver = new ObjectPathResolver(this.config.bucketName);
  }

  getSignedUrl(
    path: string,
    expiresIn: number = this.config.defaultSignedUrlExpiresIn
  ): Promise<string> {
    return this.s3.getSignedUrlPromise('putObject', {
      Bucket: this.config.bucketName,
      Key: path,
      Expires: expiresIn,
      ContentType: 'image/jpeg'
    });
  }
}

export class ObjectPathResolver {
  constructor(public readonly bucketName: string) {}

  getTravelRoomCoverImagePath(
    travelRoomId: string,
    ext: string = 'jpeg'
  ): string {
    return `travel-room/cover-image/${travelRoomId}.${ext}`;
  }
}
