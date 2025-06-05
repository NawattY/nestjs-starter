import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
@Index('idx_users_email', ['email'])
@Index('idx_users_mobile', ['mobile'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 100 })
  password: string;

  @Column({ length: 100 })
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 20, unique: true, nullable: true })
  mobile: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
