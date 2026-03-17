import { UserRole } from '../../common/models/users.models';
import { Roadmap } from '../../roadmaps-managment/entities/roadmap.entity';
import { Tutorial } from '../../tutorials-management/entities/tutorial.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isBlocked: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Tutorial, (tutorial) => tutorial.author)
  tutorials: Tutorial[];

  @OneToMany(() => Roadmap, (roadmap) => roadmap.author)
  roadmaps: Roadmap[];

  /** Timestamps */
  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
