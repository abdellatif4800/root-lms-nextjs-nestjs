import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUnitInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  unitTitle: string;

  @Field()
  content: string;

  @Field()
  publish: boolean;

  @Field(() => Int)
  order: number;
}

@InputType()
export class CreateTutorialInput {
  @Field()
  tutorialName: string;

  @Field()
  authorId: string;

  @Field()
  category: string;

  @Field()
  publish: boolean;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  level?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => [CreateUnitInput], { nullable: 'itemsAndList' })
  units?: CreateUnitInput[];
}
