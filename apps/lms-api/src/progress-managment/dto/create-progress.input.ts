import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateQuizProgressInput {
  @Field()
  userId: string;

  @Field()
  quizId: string;

  @Field(() => Int)
  score: number;

  @Field({ nullable: true })
  isCompleted?: boolean;
}

@InputType()
export class CreateTutorialProgressInput {
  @Field()
  userId: string;

  @Field()
  tutorialId: string;

  @Field({ nullable: true })
  percentage?: number;

  @Field({ nullable: true })
  currentUnitId?: string;

  @Field({ nullable: true })
  isCompleted?: boolean;
}

@InputType()
export class CreateUnitProgressInput {
  @Field()
  userId: string;

  @Field()
  unitId: string;

  @Field({ nullable: true })
  isCompleted?: boolean;
}
