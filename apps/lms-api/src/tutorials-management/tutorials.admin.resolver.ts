import { Mutation, Args, Context, ID, Query, Resolver } from '@nestjs/graphql';
import { TutorialsService } from './tutorials.service';
import { CreateTutorialInput } from './dto/create-tutorial.input';
import { UpdateTutorialInput } from './dto/update-tutorial.input';
import { TutorialType } from './entities/tutorial.graphqlTypes';

@Resolver(() => TutorialType)
export class TutorialsAdminResolver {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Mutation(() => TutorialType)
  createTutorial(
    @Args('input', { type: () => CreateTutorialInput })
    input: CreateTutorialInput,
    @Context() ctx,
  ) {
    return this.tutorialsService.create(input);
  }

  @Query(() => Boolean, {
    description: 'Required by GraphQL spec (do not use)',
  })
  _adminQueryRoot() {
    return true;
  }

  @Mutation(() => TutorialType)
  updateTutorial(
    @Args('updateTutorialInput') updateTutorialInput: UpdateTutorialInput,
  ) {
    return this.tutorialsService.update(
      updateTutorialInput.id,
      updateTutorialInput,
    );
  }

  @Mutation(() => TutorialType)
  removeTutorial(@Args('id', { type: () => ID }) id: string) {
    return this.tutorialsService.remove(id);
  }
}
