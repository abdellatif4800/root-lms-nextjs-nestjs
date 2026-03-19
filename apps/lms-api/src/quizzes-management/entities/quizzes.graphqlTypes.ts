import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { QuestionType } from './quizzes.entity';

// ─── Register enum for GraphQL ────────────────────────────────────────────────

registerEnumType(QuestionType, {
  name: 'QuestionType',
  description: 'Type of quiz question',
});

// ─── QuestionOption ───────────────────────────────────────────────────────────

@ObjectType()
export class QuestionOptionType {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field()
  isCorrect: boolean;

  @Field(() => Int, { nullable: true })
  order?: number;

  @Field()
  questionId: string;
}

// ─── Question ─────────────────────────────────────────────────────────────────

@ObjectType()
export class QuestionType_ {
  @Field(() => ID)
  id: string;

  @Field()
  text: string;

  @Field(() => QuestionType)
  type: QuestionType;

  @Field(() => Int)
  points: number;

  @Field(() => Int, { nullable: true })
  order?: number;

  @Field({ nullable: true })
  modelAnswer?: string;

  @Field({ nullable: true })
  correctBooleanAnswer?: string;

  @Field()
  quizId: string;

  // options only populated for MCQ — empty array for others
  @Field(() => [QuestionOptionType], { nullable: 'itemsAndList' })
  options?: QuestionOptionType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

@ObjectType()
export class QuizType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int)
  passMark: number;

  @Field(() => Int)
  timeLimit: number;

  @Field()
  shuffleQuestions: boolean;

  @Field()
  publish: boolean;

  @Field(() => [QuestionType_], { nullable: 'itemsAndList' })
  questions?: QuestionType_[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
