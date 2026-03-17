import { CreateTutorialInput } from './create-tutorial.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateTutorialInput extends PartialType(CreateTutorialInput) {
  @Field(() => ID)
  id: string;
}
