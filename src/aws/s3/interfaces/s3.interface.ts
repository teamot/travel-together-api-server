import { S3 } from 'aws-sdk';

export type S3Config = S3.ClientConfiguration & {
  bucketName: string;
  defaultSignedUrlExpiresIn: number;
};

export interface ResolvedPath {
  bucketName: string;
  path: string;
}
