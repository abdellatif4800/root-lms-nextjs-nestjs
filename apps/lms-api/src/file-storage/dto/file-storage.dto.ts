import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class FileStorageInput {
  @Field(() => String)
  bucketName: string;

  @Field(() => String)
  filename: string;

  @Field(() => String)
  mimeType: string;
}
