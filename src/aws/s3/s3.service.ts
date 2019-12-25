import { S3 } from 'aws-sdk';
import { S3Config, ResolvedPath } from './interfaces/s3.interface';

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.log(
    `환경변수 AWS_ACCESS_KEY_ID 또는 AWS_SECRET_ACCESS_KEY가 정의되어있지 않습니다.`
  );
  process.exit(-1);
}

const signatureVersion = 'v4';
const region = 'us-east-1';
const bucketName = 'travel-together2';
const defaultS3Configuration: S3Config = {
  defaultSignedUrlExpiresIn: 5 * 60, // 5분
  bucketName,
  signatureVersion,
  region,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
};

export class S3Service {
  public readonly objectPathResolver: ObjectPathResolver;

  private s3: S3;

  constructor(public readonly config: S3Config = defaultS3Configuration) {
    this.s3 = new S3(config);
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
  constructor(private readonly bucketName: string) {}

  getTravelRoomCoverImagePath(
    travelRoomId: string,
    ext: string = 'jpeg'
  ): ResolvedPath {
    return this.makeResolvedPath(
      `travel-room/cover-image/${travelRoomId}.${ext}`
    );
  }

  private makeResolvedPath(path: string): ResolvedPath {
    return {
      bucketName: this.bucketName,
      path: path
    };
  }
}
