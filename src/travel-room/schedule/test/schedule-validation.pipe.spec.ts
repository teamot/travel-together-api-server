import { ScheduleValidationPipe } from '../schedule-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { ScheduleType } from '../schedule.enum';

describe('ScheduleValidationPipe', () => {
  let scheduleValidationPipe: ScheduleValidationPipe;
  beforeAll(() => {
    scheduleValidationPipe = new ScheduleValidationPipe();
  });

  it('type 속성의 타입이 올바르지 않으면 예외를 던진다', async () => {
    const value = {
      type: 'invalid type',
      name: 'name',
      place: 'place'
    };

    await expect(scheduleValidationPipe.transform(value)).rejects.toThrowError(
      BadRequestException
    );
  });

  it("type이 'normal'일 때 place 속성의 타입이 올바르지 않으면 에러를 던진다", async () => {
    const value = {
      type: ScheduleType.NORMAL,
      name: 'name',
      place: {
        invalidType: true
      }
    };

    await expect(scheduleValidationPipe.transform(value)).rejects.toThrowError(
      BadRequestException
    );
  });

  it("type이 'normal'일 때 transport, departureTime, arrivalTime 속성에 대한 검사는 하지 않는다", async () => {
    const value = {
      type: ScheduleType.NORMAL,
      name: 'name',
      place: 'place',
      transport: 1,
      departureTime: 'hi',
      arrivalTime: {
        invalidType: null
      }
    };

    expect(await scheduleValidationPipe.transform(value)).toBe(value);
  });

  it("type이 'transfer'일 때 transport, departureTime, arrivalTime 속성의 타입이 올바르지 않으면 에러를 던진다", async () => {
    const values = [
      {
        type: ScheduleType.TRANSFER,
        name: 'name',
        transport: {},
        departureTime: '2019-01-01 01:01:01',
        arrivalTime: '2019-01-01 01:01:01'
      },
      {
        type: ScheduleType.TRANSFER,
        name: 'name',
        transport: 'taxi',
        departureTime: 'abc',
        arrivalTime: '2019-01-01 01:01:01'
      },
      {
        type: ScheduleType.TRANSFER,
        name: 'name',
        transport: 'taxi',
        departureTime: '2019-01-01 01:01:01',
        arrivalTime: 'abc'
      }
    ];

    await Promise.all(
      values.map(value =>
        expect(scheduleValidationPipe.transform(value)).rejects.toThrow(
          BadRequestException
        )
      )
    );
  });

  it("type이 'transfer'일 때 transport, departureTime, arrivalTime 속성의 타입이 올바르면 그대로 반환한다", async () => {
    const value = {
      type: ScheduleType.TRANSFER,
      name: 'name',
      transport: 'taxi',
      departureTime: '2019-01-01 01:01:11',
      arrivalTime: new Date().toISOString()
    };

    expect(await scheduleValidationPipe.transform(value)).toBe(value);
  });

  it("type이 'transfer'일 때 place 속성에 대한 검사는 하지 않는다", async () => {
    const value = {
      type: ScheduleType.TRANSFER,
      name: 'name',
      place: {},
      transport: 'taxi',
      departureTime: '2019-01-01',
      arrivalTime: new Date().toISOString()
    };

    expect(await scheduleValidationPipe.transform(value)).toBe(value);
  });
});
