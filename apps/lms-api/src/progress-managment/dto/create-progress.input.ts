import { InputType, Field } from '@nestjs/graphql';

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
