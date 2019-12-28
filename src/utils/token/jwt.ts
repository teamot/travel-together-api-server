import { promisify } from 'util';
import { sign, verify, Secret, SignOptions } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { IJwtPayload, IJwtEncodeReturn } from './interfaces/jwt.interface';

@Injectable()
export class JwtHelper {
  private jwtSecret: string;
  private signPromise: (
    payload: IJwtPayload,
    jwtSecret: Secret,
    config?: SignOptions
  ) => Promise<string> = promisify(sign);

  constructor() {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
      this.jwtSecret = jwtSecret;
    } else {
      throw new Error('Environmental Variable JWT_SECRET is undefined');
    }
  }

  async encode(payload: IJwtPayload): Promise<IJwtEncodeReturn> {
    const token = await this.signPromise(payload, this.jwtSecret, {
      noTimestamp: true
    });
    return { token, payload };
  }

  verify(token: string): IJwtPayload | undefined {
    try {
      return verify(token, this.jwtSecret) as IJwtPayload;
    } catch (error) {
      return undefined;
    }
  }

  generateExp(expIn: number = 604800 /* 일주일 (테스트용) */) {
    return Math.floor(Date.now() / 1000) + expIn;
  }
}
