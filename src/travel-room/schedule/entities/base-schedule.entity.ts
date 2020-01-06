import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Entity
} from 'typeorm';
import { TravelRoom } from '../../entities/travel-room.entity';
import { ScheduleType } from '../schedule.enum';

@Entity()
export class BaseSchedule extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: ScheduleType;

  @Column({ length: 64 })
  name: string;

  @Column({ length: 256, nullable: true })
  memo?: string;

  @Column({ nullable: true })
  startDate?: Date;

  @Column({ default: false })
  timeSet: boolean;

  @Column()
  sequence: number;

  @OneToMany(
    _type => TravelRoom,
    travelRoom => travelRoom.schedules
  )
  travelRoom: TravelRoom;
}
