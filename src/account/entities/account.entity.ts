import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn
} from 'typeorm';

@Entity('Account')
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  statusMessage?: string;

  @Column({ unique: true })
  refreshToken: string;

  @Index()
  @Column({ nullable: true })
  oauthId: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;
}
