import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateTutorialProgressInput } from './create-progress.input';

@InputType()
export class UpdateTutorialProgressInput extends PartialType(
  CreateTutorialProgressInput,
) {
  @Field()
  id: string;

  @Field({ nullable: true })
  percentage?: number;

  @Field({ nullable: true })
  currentUnitId?: string;

  @Field({ nullable: true })
  isCompleted?: boolean;
}

@InputType()
export class UpdateUnitProgressInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  isCompleted?: boolean;
}
