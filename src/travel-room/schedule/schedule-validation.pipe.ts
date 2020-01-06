import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
// import { CreateScheduleBodyDto } from './schedule.dto';
import { ScheduleType } from './schedule.enum';
import { CreateScheduleBodyDto } from './schedule.dto';

@Injectable()
export class ScheduleValidationPipe implements PipeTransform {
  async transform(value: any, _metadata?: ArgumentMetadata) {
    const type = value.type;

    if (this.isValidScheduleType(value.type)) {
      const errors = await validate(
        plainToClass(CreateScheduleBodyDto, value),
        { groups: [type] }
      );

      if (errors.length > 0) {
        // console.log(errors);
        throw new BadRequestException(
          errors[0].constraints,
          errors[0].toString()
        );
      }

      return value;
    } else {
      throw new BadRequestException('Invalid ScheduleType.');
    }
  }

  private isValidScheduleType(value: any): value is ScheduleType {
    return Object.values(ScheduleType).includes(value);
  }
}
