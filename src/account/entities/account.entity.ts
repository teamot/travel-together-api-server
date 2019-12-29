import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  ManyToMany
} from 'typeorm';
import { TravelRoom } from '../../travel-room/entities/travel-room.entity';

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  statusMessage?: string;

  @Column({ unique: true, select: false })
  refreshToken: string;

  @Index()
  @Column({ nullable: true, select: false })
  oauthId: string;

  @Column({ nullable: true })
  profileImagePath?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(
    _type => TravelRoom,
    travelRoom => travelRoom.members
  )
  joinedTravelRooms: TravelRoom[];
}
