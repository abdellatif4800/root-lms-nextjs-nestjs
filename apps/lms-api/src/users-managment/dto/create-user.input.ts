import { InputType, Int, Field } from '@nestjs/graphql';
import { UserRole } from '../../common/models/users.models';
import { Column } from 'typeorm';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  isBlocked: boolean;

  @Field(() => UserRole, { nullable: true })
  role: UserRole;
}
