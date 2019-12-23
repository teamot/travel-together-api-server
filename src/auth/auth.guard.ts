import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtHelper } from '../utils/token/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.getBearerToken(request);
    if (!token) {
      return false;
    }

    const payload = this.jwtHelper.verify(token);
    if (!payload) {
      return false;
    }

    request.body.accountId = payload.sub;
    return true;
  }

  private getBearerToken(request: Request): string | undefined {
    const value = request.header('Authorization');
    if (!value) return undefined;

    const [tokenType, token] = value.split(' ');
    if (tokenType.toUpperCase() !== 'BEARER') {
      return undefined;
    }

    return token;
  }
}
