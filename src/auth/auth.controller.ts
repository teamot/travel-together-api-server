import { Controller, Post, Body } from '@nestjs/common';
import {} from 'express';
import { AuthService } from './auth.service';
import { OAuthLoginOptions } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('oauth/login')
  public login(@Body() oauthLoginOptions: OAuthLoginOptions) {
    return this.authService.getTokensByOAuth(oauthLoginOptions);
  }
}
