import {
  IsUUID,
  MaxLength,
  IsDate,
  IsBoolean,
  IsEnum,
  IsString
} from 'class-validator';
import { ScheduleType } from './schedule.enum';
import { Type } from 'class-transformer';

export class CreateScheduleParamDto {
  @IsUUID('4')
  travelRoomId: string;
}

export class CreateScheduleBodyDto {
  @MaxLength(32)
  name: string;

  @IsEnum(ScheduleType)
  type: ScheduleType;

  @MaxLength(128)
  memo?: string;

  @IsDate()
  startDate?: Date;

  @IsBoolean()
  timeSet?: boolean;

  /** Normal Schedule **/
  @IsString({ groups: [ScheduleType.NORMAL] })
  place?: string;

  /** Transfer Schedule **/
  @IsString({ groups: [ScheduleType.TRANSFER] })
  transport?: string;

  @Type(() => Date)
  @IsDate({ groups: [ScheduleType.TRANSFER] })
  departureTime?: Date;

  @Type(() => Date)
  @IsDate({ groups: [ScheduleType.TRANSFER] })
  arrivalTime?: Date;
}
