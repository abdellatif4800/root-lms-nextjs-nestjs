import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../../common/models/users.models';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User role enum',
});

@ObjectType()
export class UsersType {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  isBlocked: boolean;

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  stripeCustomerId: string;

  @Field({ nullable: true })
  subscriptionId: string;

  @Field({ nullable: true })
  subscriptionStatus: string;

  @Field(() => Date, { nullable: true }) // ← add nullable: true
  currentPeriodEnd: Date | null; // ← add | null

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field(() => UsersType, { nullable: true })
  user?: UsersType;
}

@ObjectType()
export class PayloadType {
  @Field()
  sub: string;

  @Field()
  username: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  email: string;

  @Field({ nullable: true })
  subscriptionStatus: string;

  @Field({ nullable: true })
  iat?: number; // issued at timestamp

  @Field({ nullable: true })
  exp?: number; // expiration timestamp
}
