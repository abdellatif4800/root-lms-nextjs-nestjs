import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TutorialStats {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  published: number;

  @Field(() => Int)
  draft: number;
}

@ObjectType()
export class SystemStatsType {
  @Field(() => TutorialStats)
  tutorials: TutorialStats;

  @Field(() => Int)
  roadmapsCount: number;

  @Field(() => Int)
  quizzesCount: number;
}
