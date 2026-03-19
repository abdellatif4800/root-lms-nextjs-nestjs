import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// ─── Enums ────────────────────────────────────────────────────────────────────

export enum QuestionType {
  MCQ = 'MCQ',
  TRUE_OR_FALSE = 'TRUE_OR_FALSE',
  ESSAY = 'ESSAY',
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int', default: 70 })
  passMark: number; // percentage e.g. 70 = 70%

  @Column({ type: 'int', default: 0 })
  timeLimit: number; // minutes, 0 = no limit

  @Column({ default: false })
  shuffleQuestions: boolean;

  @Column({ default: false })
  publish: boolean;

  // ─── Questions ───
  @OneToMany(() => Question, (q) => q.quiz, { cascade: true })
  questions: Question[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ─── Question ─────────────────────────────────────────────────────────────────

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @Column({ type: 'int', default: 1 })
  points: number;

  @Column({ type: 'int', nullable: true })
  order?: number;

  // ─── For ESSAY: store the model answer (admin reference only) ───
  @Column({ type: 'text', nullable: true })
  modelAnswer?: string;

  // ─── For TRUE_OR_FALSE: store correct answer ───
  // 'true' | 'false' stored as string
  @Column({ nullable: true })
  correctBooleanAnswer?: string;

  // ─── Relation to Quiz ───
  @Column({ type: 'uuid' })
  quizId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quizId' })
  quiz: Quiz;

  // ─── Options (MCQ only) ───
  @OneToMany(() => QuestionOption, (o) => o.question, { cascade: true })
  options: QuestionOption[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ─── QuestionOption (MCQ options) ─────────────────────────────────────────────

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ default: false })
  isCorrect: boolean; // admin marks the correct option(s)

  @Column({ type: 'int', nullable: true })
  order?: number;

  // ─── Relation to Question ───
  @Column({ type: 'uuid' })
  questionId: string;

  @ManyToOne(() => Question, (q) => q.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: Question;
}
