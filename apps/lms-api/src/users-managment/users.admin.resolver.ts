import { UsersType } from './entities/users.graphqlTypes';
import { UsersService } from './users.service';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

@Resolver(() => UsersType)
export class UsersAdminResolver {
  constructor(private readonly usersService: UsersService) {}
}
