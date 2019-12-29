import { MaxLength, IsUUID, IsEnum } from 'class-validator';
import { ImageFormat } from '../common/format';

export class ModifyProfileDto {
  @IsUUID('4')
  accountId: string;

  @MaxLength(32, {
    message: '여행방 이름은 최대 32자까지 가능합니다.'
  })
  name?: string;

  @MaxLength(32, {
    message: '상태 메시지는 최대 32자까지 가능합니다.'
  })
  statusMessage?: string;
}

export class GetProfileImageUploadUrlDto {
  @IsEnum(ImageFormat, {
    message: '이미지 형식이 올바르지 않습니다.'
  })
  format: ImageFormat;
}
