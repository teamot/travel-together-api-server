import { Module, Global } from '@nestjs/common';
import { JwtHelper } from './jwt';

@Global()
@Module({ providers: [JwtHelper], exports: [JwtHelper] })
export class TokenModule {}
