import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { UsersType } from '../../users-managment/entities/users.graphqlTypes';
import { TutorialType } from '../../tutorials-management/entities/tutorial.graphqlTypes';

@ObjectType()
export class RoadmapNodeType {
  @Field(() => ID)
  id: string;

  @Field()
  clientId: string;

  @Field(() => TutorialType)
  tutorial: TutorialType;

  @Field(() => Float)
  positionX: number;

  @Field(() => Float)
  positionY: number;
}

@ObjectType()
export class RoadmapEdgeType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  sourceNodeId: string;

  @Field(() => ID)
  targetNodeId: string;

  // 👇 Add these
  @Field({ nullable: true })
  sourceClientId?: string;

  @Field({ nullable: true })
  targetClientId?: string;
}

@ObjectType()
export class RoadmapType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => UsersType)
  author: UsersType;

  @Field()
  authorId: string;

  @Field(() => [RoadmapNodeType], { nullable: 'itemsAndList' })
  nodes?: RoadmapNodeType[];

  @Field(() => [RoadmapEdgeType], { nullable: 'itemsAndList' })
  edges?: RoadmapEdgeType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
