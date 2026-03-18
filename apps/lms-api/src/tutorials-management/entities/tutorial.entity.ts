import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Users } from '../../users-managment/entities/user.entity';
import {
  Roadmap,
  RoadmapNode,
} from '../../roadmaps-managment/entities/roadmap.entity';

@Entity('tutorials')
export class Tutorial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  tutorialName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  level?: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column()
  category: string;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ type: 'int', nullable: true })
  price: number;

  @ManyToOne(() => Users, (user) => user.tutorials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: Users;

  // 🔹 Roadmap nodes referencing this tutorial
  @OneToMany(() => RoadmapNode, (node) => node.tutorial)
  roadmapNodes: RoadmapNode[];

  @Column({ type: 'uuid' })
  authorId: string;

  /** Relations */
  @OneToMany(() => Unit, (unit) => unit.tutorial, {
    cascade: true,
  })
  units?: Unit[];

  @Column({ default: false })
  publish: boolean;

  /** Timestamps */
  @CreateDateColumn({ default: new Date() })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  unitTitle?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'int', nullable: true })
  order?: number;

  // ─── Mux fields ───
  @Column({ nullable: true })
  muxUploadId?: string; // from upload creation

  @Column({ nullable: true })
  muxAssetId?: string; // from webhook after upload

  @Column({ nullable: true })
  muxPlaybackId?: string; // used by the player

  @Column({ nullable: true, default: 'waiting' })
  videoStatus?: string; // waiting | processing | ready | error

  /** Relations */
  @Column({ type: 'uuid', nullable: true })
  tutorialId: string;

  @Column({ default: false })
  publish: boolean;

  @ManyToOne(() => Tutorial, (tutorial) => tutorial.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tutorialId' })
  tutorial: Tutorial;

  /** Timestamps */
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
