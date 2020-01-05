import {
  MaxLength,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUUID,
  IsArray
} from 'class-validator';
import { CountryCode } from '../country/interfaces/country.interfaces';
import { ImageFormat } from '../common/format';
import { Optional } from '@nestjs/common';

export class CreateTravelRoomDto {
  @MaxLength(32, {
    message: '여행 이름은 최대 32글자까지만 가능합니다.'
  })
  name: string;

  @IsDateString({
    message: '날짜 형식이 올바르지 않습니다.'
  })
  startDate: Date;

  @IsDateString({
    message: '날짜 형식이 올바르지 않습니다.'
  })
  endDate: Date;

  @IsArray()
  @IsEnum(CountryCode, {
    each: true
  })
  countries: CountryCode[];

  accountId: string;
}

export class PatchTravelRoomDto {
  @IsOptional()
  @MaxLength(32, {
    message: '여행 이름은 최대 32글자까지만 가능합니다.'
  })
  name?: string;

  @IsOptional()
  @IsDateString({
    message: '날짜 형식이 올바르지 않습니다.'
  })
  startDate?: Date;

  @IsOptional()
  @IsDateString({
    message: '날짜 형식이 올바르지 않습니다.'
  })
  endDate?: Date;

  @Optional()
  @IsArray()
  @IsEnum(CountryCode, {
    each: true
  })
  countries?: CountryCode[];

  accountId: string;
}

export class GetTravelRoomCoverImageUploadUrlDto {
  @IsUUID('4', {
    message: '여행방 아이디가 유효하지 않습니다.'
  })
  travelRoomId: string;

  @IsEnum(ImageFormat, {
    message: '이미지 형식이 올바르지 않습니다.'
  })
  format: ImageFormat;
}

export class TravelRoomIdDto {
  @IsUUID('4')
  id: string;
}
