import { IsEnum, IsString } from 'class-validator';
import { OAuthServer } from '../utils/oauth/interfaces/oauth.interface';

export class OAuthLoginOptions {
  @IsEnum(OAuthServer)
  oauthServer: OAuthServer;

  @IsString()
  oauthId: string;

  @IsString()
  oauthToken: string;
}
