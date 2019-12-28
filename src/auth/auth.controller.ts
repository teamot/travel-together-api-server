import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import {} from 'express';
import { AuthService } from './auth.service';
import { OAuthLoginOptions } from './auth.dto';
import { ITokenData } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('oauth/login')
  login(@Body() oauthLoginOptions: OAuthLoginOptions): Promise<ITokenData> {
    return this.authService.getTokensByOAuth(oauthLoginOptions);
  }

  @Get('refresh')
  refreshToken(@Headers('x-rt') refreshToken: string): Promise<ITokenData> {
    return this.authService.refreshToken(refreshToken);
  }
}
