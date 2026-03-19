import { InputType, Field, Int, ID, PartialType } from '@nestjs/graphql';
import { QuestionType } from '../entities/quizzes.entity';

// ─── Option Input ─────────────────────────────────────────────────────────────

@InputType()
export class CreateOptionInput {
  @Field({ nullable: true })
  id?: string; // provided on edit so we can upsert

  @Field()
  text: string;

  @Field()
  isCorrect: boolean;

  @Field(() => Int, { nullable: true })
  order?: number;
}

// ─── Question Input ───────────────────────────────────────────────────────────

@InputType()
export class CreateQuestionInput {
  @Field({ nullable: true })
  id?: string; // provided on edit

  @Field()
  text: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field(() => Int, { defaultValue: 1 })
  points: number;

  @Field(() => Int, { nullable: true })
  order?: number;

  // essay model answer (admin reference)
  @Field({ nullable: true })
  modelAnswer?: string;

  // true/false correct answer: 'true' | 'false'
  @Field({ nullable: true })
  correctBooleanAnswer?: string;

  // MCQ options — ignored for other types
  @Field(() => [CreateOptionInput], { nullable: 'itemsAndList' })
  options?: CreateOptionInput[];
}

// ─── Quiz Input ───────────────────────────────────────────────────────────────

@InputType()
export class CreateQuizInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { defaultValue: 70 })
  passMark: number;

  @Field(() => Int, { defaultValue: 0 })
  timeLimit: number;

  @Field({ defaultValue: false })
  shuffleQuestions: boolean;

  @Field({ defaultValue: false })
  publish: boolean;

  @Field(() => [CreateQuestionInput], { nullable: 'itemsAndList' })
  questions?: CreateQuestionInput[];
}

// ─── Update Inputs ────────────────────────────────────────────────────────────

@InputType()
export class UpdateQuizInput extends PartialType(CreateQuizInput) {
  @Field(() => ID)
  id: string;
}
