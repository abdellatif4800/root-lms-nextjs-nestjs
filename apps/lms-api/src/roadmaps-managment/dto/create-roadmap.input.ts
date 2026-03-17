import { InputType, Field, ID, Float } from '@nestjs/graphql';

@InputType()
export class RoadmapNodeInput {
  @Field({ nullable: true })
  clientId: string;

  @Field(() => ID)
  tutorialId: string;

  @Field(() => Float, { defaultValue: 0 })
  positionX: number;

  @Field(() => Float, { defaultValue: 0 })
  positionY: number;
}

@InputType()
export class RoadmapEdgeInput {
  @Field(() => ID)
  sourceNodeId: string;

  @Field(() => ID)
  targetNodeId: string;
}

@InputType()
export class CreateRoadmapInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  authorId: string;

  @Field(() => [RoadmapNodeInput], { nullable: true })
  nodes?: RoadmapNodeInput[];

  @Field(() => [RoadmapEdgeInput], { nullable: true })
  edges?: RoadmapEdgeInput[];
}
