import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { UsersType } from '../../users-managment/entities/users.graphqlTypes';

@ObjectType()
export class TutorialType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  tutorialName?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  level?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  category: string;

  @Field()
  isPaid: boolean;

  @Field(() => Int, { nullable: true })
  price: number;

  @Field(() => UsersType)
  author: UsersType;

  @Field()
  authorId: string;

  @Field()
  publish: boolean;

  @Field(() => [UnitType], { nullable: 'itemsAndList' }) // one-to-many relation
  units?: UnitType[];

  @Field(() => [String], { nullable: true })
  unitsTitlesList?: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('TutorialUnit')
export class UnitType {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  unitTitle?: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => Int, { nullable: true })
  order?: number;

  @Field()
  publish: boolean;

  @Field()
  tutorialId: string; // relation back to tutorial

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
