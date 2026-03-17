import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { UsersType } from '../../users-managment/entities/users.graphqlTypes';
import {
  TutorialType,
  UnitType,
} from '../../tutorials-management/entities/tutorial.graphqlTypes';

@ObjectType()
export class TutorialWithProgressType {
  @Field(() => ID)
  id: string;

  // Keep ID only if frontend needs it
  @Field(() => ID, { nullable: true })
  userId?: string;

  @Field(() => ID)
  tutorialId: string;

  // ✅ Optional relation (only if you load it in resolver)
  @Field(() => UsersType, { nullable: true })
  user?: UsersType;

  @Field(() => TutorialType, { nullable: true })
  tutorial?: TutorialType;

  @Field(() => Float)
  percentage: number;

  @Field(() => ID, { nullable: true })
  currentUnitId?: string;

  @Field(() => Boolean)
  isCompleted: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class UnitProgressType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  unitId: string;

  @Field(() => UsersType, { nullable: true })
  user?: UsersType;

  @Field(() => UnitType, { nullable: true })
  unit?: UnitType;

  @Field(() => Boolean)
  isCompleted: boolean;

  @Field()
  createdAt: Date;
}
