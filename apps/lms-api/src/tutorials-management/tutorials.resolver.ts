import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Context,
  ID,
} from '@nestjs/graphql';
import { TutorialsService } from './tutorials.service';
import { TutorialType, UnitType } from './entities/tutorial.graphqlTypes';
import { CreateTutorialInput } from './dto/create-tutorial.input';
import { UpdateTutorialInput } from './dto/update-tutorial.input';
import { log } from 'console';
import { FilterTutorialInput } from './dto/filter-tutorial.input';

@Resolver(() => TutorialType)
export class TutorialsResolver {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Query(() => [TutorialType], { name: 'tutorialList' })
  findAll(
    @Args('filters', { type: () => FilterTutorialInput, nullable: true })
    filters?: FilterTutorialInput,
  ) {
    return this.tutorialsService.findAll(filters);
  }

  @Query(() => TutorialType, { name: 'tutorialById' })
  findOne(@Args('id', { type: () => ID }) id: string, @Context() ctx) {
    // log(ctx.req.headers);

    return this.tutorialsService.findOne(id);
  }

  @Query(() => UnitType, { name: 'unitById' })
  findUnitById(@Args('id', { type: () => ID }) id: string) {
    return this.tutorialsService.findUnitById(id);
  }
}
