import {
  MaxLength,
  IsEnum,
  IsOptional,
  IsDateString,
  IsUUID
  // IsUUID
} from 'class-validator';
import { CountryCode } from '../country/interfaces/country.interfaces';

export class CreateTravelRoomDto {
  @MaxLength(32, {
    message: '여행 이름은 최대 32글자까지만 가능합니다.'
  })
  name: string;

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

  @IsEnum(CountryCode, {
    each: true
  })
  countries?: CountryCode[];

  accountId: string;
}

export class GetTravelRoomCoverImageUploadUrlDto {
  @IsUUID('4')
  travelRoomId: string;
}
