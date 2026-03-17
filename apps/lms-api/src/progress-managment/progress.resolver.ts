import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { ProgressService } from './progress.service';
import { UnitProgress } from './entities/progress.entity';
import {
  CreateTutorialProgressInput,
  CreateUnitProgressInput,
} from './dto/create-progress.input';
import {
  UpdateTutorialProgressInput,
  UpdateUnitProgressInput,
} from './dto/update-progress.input';
import {
  TutorialWithProgressType,
  UnitProgressType,
} from './entities/progress.graphqlTypes';
import { log } from 'console';
import { Request, Response } from 'express';

@Resolver(() => TutorialWithProgressType)
export class ProgressResolver {
  constructor(private readonly progressService: ProgressService) {}

  @Mutation(() => UnitProgressType)
  createUnitProgress(
    @Args('createUnitProgressInput')
    createUnitProgressInput: CreateUnitProgressInput,
  ) {
    return this.progressService.createUnitProgress(createUnitProgressInput);
  }

  @Query(() => [UnitProgressType], { name: 'unitProgress' })
  findAllUnitProgress() {
    return this.progressService.findAllUnitProgress();
  }

  @Query(() => UnitProgressType, { name: 'unitProgress' })
  findOneUnitProgress(@Args('id', { type: () => ID }) id: string) {
    return this.progressService.findOneUnitProgress(id);
  }

  @Mutation(() => UnitProgressType)
  updateUnitProgress(
    @Args('updateUnitProgressInput')
    updateUnitProgressInput: UpdateUnitProgressInput,
  ) {
    return this.progressService.updateUnitProgress(
      updateUnitProgressInput.id,
      updateUnitProgressInput,
    );
  }

  @Query(() => [UnitProgressType], { name: 'unitProgressByUser' })
  findUnitProgressByUserId(@Args('userId', { type: () => ID }) userId: string) {
    return this.progressService.findUnitProgressByUserId(userId);
  }

  @Query(() => [UnitProgressType], { name: 'unitProgressByTutorialAndUser' })
  findUnitProgressByTutorialAndUser(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('tutorialId', { type: () => ID }) tutorialId: string,
  ) {
    return this.progressService.findUnitProgressByTutorialAndUser(
      userId,
      tutorialId,
    );
  }

  @Query(() => [TutorialWithProgressType], {
    name: 'tutorialsWithProgressByUser',
  })
  findTutorialsWithProgressByUser(
    @Args('userId', { type: () => ID }) userId: string,
    @Context() ctx: { req: Request; res: Response },
  ) {
    log('asd', ctx.req.cookies);

    return this.progressService.findTutorialsWithProgressByUser(userId);
  }
}
