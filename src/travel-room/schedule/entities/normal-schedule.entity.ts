import { BaseSchedule } from './base-schedule.entity';
import { Column, PrimaryColumn, OneToOne, JoinColumn, Entity } from 'typeorm';

@Entity()
export class NormalSchedule extends BaseSchedule {
  @JoinColumn({ name: 'baseId' })
  @OneToOne(_type => BaseSchedule)
  @PrimaryColumn()
  baseId: string;

  @Column({ nullable: true })
  place?: string;
}
