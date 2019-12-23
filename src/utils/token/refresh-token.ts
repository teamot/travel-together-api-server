import { Injectable } from '@nestjs/common';
import uuidv4 from 'uuid/v4';

@Injectable()
export class RefreshTokenGenerator {
  public generate(): string {
    return uuidv4()
      .split('-')
      .join('');
  }
}
