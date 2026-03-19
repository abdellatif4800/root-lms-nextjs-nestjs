import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  AuthResponse,
  PayloadType,
  UsersType,
} from './entities/users.graphqlTypes';
import { FindUserInput } from './dto/find-user.input';
import { UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { log } from 'console';

@Resolver(() => UsersType)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UsersType, { name: 'registerUser' })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [UsersType], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Mutation(() => AuthResponse, { name: 'user_signin' })
  async findUser(
    @Args('userData') userData: FindUserInput,
    @Context() ctx: { res: Response },
  ) {
    const result: any = await this.usersService.findUser(userData);

    ctx.res.cookie('lms_access_token', result.access_token, {
      httpOnly: true,
      sameSite: 'none', // Required for cross-site
      secure: true, // Required for SameSite='none' (works on HTTPS/Vercel)
      // sameSite: 'lax', // 'none' if cross-site
      // secure: false, // true in production
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return result;
    // return this.usersService.findUser(userData);
  }

  @Query(() => PayloadType, { name: 'me' })
  async me(@Context() ctx: { req: Request }) {
    const token: string = ctx.req.cookies['lms_access_token'];

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.usersService.getUserFromToken(token);

      return {
        sub: payload.sub,
        username: payload.username,
        role: payload.role,
        email: payload.email,
        subscriptionStatus: payload.subscriptionStatus,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (err) {
      return err;
    }
  }

  @Mutation(() => Boolean)
  logout(@Context() ctx: { res: Response }) {
    ctx.res.clearCookie('lms_access_token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true, // must match cookie options
    });

    return true;
  }

  @Mutation(() => UsersType)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => UsersType)
  removeUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.remove(id);
  }
}
