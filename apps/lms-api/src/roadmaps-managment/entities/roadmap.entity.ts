import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Users } from '../../users-managment/entities/user.entity';
import { Tutorial } from '../../tutorials-management/entities/tutorial.entity';

@Entity('roadmaps')
export class Roadmap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Users, (user) => user.roadmaps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: Users;

  @Column({ type: 'uuid' })
  authorId: string;

  // 🔹 Nodes inside roadmap
  @OneToMany(() => RoadmapNode, (node) => node.roadmap, {
    cascade: true,
  })
  nodes: RoadmapNode[];

  // 🔹 Edges inside roadmap
  @OneToMany(() => RoadmapEdge, (edge) => edge.roadmap, {
    cascade: true,
  })
  edges: RoadmapEdge[];

  /** Timestamps */
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('roadmap_nodes')
export class RoadmapNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  clientId: string; // e.g. "node-1", "node-2"

  // 🔹 Roadmap relation
  @ManyToOne(() => Roadmap, (roadmap) => roadmap.nodes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roadmapId' })
  roadmap: Roadmap;

  @Column({ type: 'uuid' })
  roadmapId: string;

  // 🔹 Tutorial relation
  @ManyToOne(() => Tutorial, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutorialId' })
  tutorial: Tutorial;

  @Column({ type: 'uuid' })
  tutorialId: string;

  // 🔹 Position (for React Flow)
  @Column('float')
  positionX: number;

  @Column('float')
  positionY: number;
}

@Entity('roadmap_edges')
export class RoadmapEdge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔹 Roadmap relation
  @ManyToOne(() => Roadmap, (roadmap) => roadmap.edges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roadmapId' })
  roadmap: Roadmap;

  @Column({ type: 'uuid' })
  roadmapId: string;

  // 🔹 Source node
  @ManyToOne(() => RoadmapNode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sourceNodeId' })
  sourceNode: RoadmapNode;

  @Column({ type: 'uuid' })
  sourceNodeId: string;

  // 🔹 Target node
  @ManyToOne(() => RoadmapNode, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetNodeId' })
  targetNode: RoadmapNode;

  @Column({ type: 'uuid' })
  targetNodeId: string;
}
