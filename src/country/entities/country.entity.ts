import { Entity, BaseEntity, PrimaryColumn, Column, ManyToMany } from 'typeorm';
import { TravelRoom } from '../../travel-room/entities/travel-room.entity';

@Entity()
export class Country extends BaseEntity {
  @PrimaryColumn()
  code: string;

  @Column()
  nameInKorean: string;

  @Column()
  nameInEnglish: string;

  @Column({ length: 8 })
  emoji: string;

  @ManyToMany(
    _type => TravelRoom,
    travelRoom => travelRoom.countries
  )
  travelRooms: TravelRoom[];
}
