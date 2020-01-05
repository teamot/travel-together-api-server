import { BaseSchedule } from './base-schedule.entity';
import { Column, OneToOne, JoinColumn, PrimaryColumn, Entity } from 'typeorm';

@Entity()
export class TransferSchedule extends BaseSchedule {
  @JoinColumn({ name: 'baseId' })
  @OneToOne(_type => BaseSchedule)
  @PrimaryColumn()
  baseId: string;

  @Column()
  transport?: string;

  @Column()
  departureTime?: Date;

  @Column()
  arrivalTime?: Date;
}
