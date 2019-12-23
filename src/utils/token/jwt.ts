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

  public async encode(payload: IJwtPayload): Promise<IJwtEncodeReturn> {
    const token = await this.signPromise(payload, this.jwtSecret, {
      noTimestamp: true
    });
    return { token, payload };
  }

  public verify(token: string): IJwtPayload | undefined {
    try {
      return verify(token, this.jwtSecret) as IJwtPayload;
    } catch (error) {
      return undefined;
    }
  }

  public generateExp(expIn: number = 900) {
    return Math.floor(Date.now()) + expIn;
  }
}
