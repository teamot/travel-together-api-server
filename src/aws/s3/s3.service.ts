import { S3 } from 'aws-sdk';
import { S3Config } from './interfaces/s3.interface';
import { Injectable } from '@nestjs/common';
import { ImageFormat } from '../../common/format';
import http from 'http';

@Injectable()
export class S3Service {
  readonly objectPathResolver: ObjectPathResolver;

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
      throw new Error(
        'Environmental variable AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY is undefined'
      );
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

  async uploadObjectFromUrl(url: string, path: string): Promise<string> {
    const response = await new Promise<http.IncomingMessage>(
      (resolve, reject) => {
        http.get(url, resolve).on('error', reject);
      }
    );

    if (!response.statusCode || response.statusCode >= 300) {
      throw new Error(
        `외부 url에서 데이터를 가져오는데 실패했습니다. 응답 상태 코드: ${response.statusCode}`
      );
    }

    const result = await this.pipeResponseToObject(response, path);
    return result.Key;
  }

  private pipeResponseToObject(
    response: http.IncomingMessage,
    path: string
  ): Promise<S3.ManagedUpload.SendData> {
    return this.s3
      .upload({
        Bucket: this.config.bucketName,
        Key: path,
        Body: response
      })
      .promise();
  }
}

export class ObjectPathResolver {
  constructor(readonly bucketName: string) {}

  getTravelRoomCoverImagePath(
    travelRoomId: string,
    format: string = ImageFormat.JPEG
  ): string {
    return `travel-room/cover-image/${travelRoomId}.${format}`;
  }

  getProfileImagePath(
    accountId: string,
    format: string = ImageFormat.JPEG
  ): string {
    return `account/profile-image/${accountId}.${format}`;
  }
}
