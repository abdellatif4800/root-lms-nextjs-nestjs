import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileStorageType {
  @Field(() => String)
  filename: string;

  @Field(() => String)
  url: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => String, { nullable: true })
  bucket?: string;

  @Field(() => String, { nullable: true })
  mimeType?: string;
}

@ObjectType()
export class BucketType {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  policy?: string;
}
