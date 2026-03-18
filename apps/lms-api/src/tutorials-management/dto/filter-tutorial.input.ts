import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class FilterTutorialInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  tutorialName?: string; // maybe partial match

  @Field(() => [String], { nullable: true })
  levels?: string[];

  @Field(() => [String], { nullable: true })
  categories?: string[];

  @Field({ nullable: true })
  authorId?: string;

  @Field()
  publish: boolean;

  @Field({ nullable: true })
  isPaid?: boolean;

  @Field(() => Int, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  createdAfter?: Date;

  @Field({ nullable: true })
  createdBefore?: Date;
}
