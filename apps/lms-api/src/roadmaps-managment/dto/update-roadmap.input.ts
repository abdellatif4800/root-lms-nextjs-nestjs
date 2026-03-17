import { InputType, Field, ID, Float } from '@nestjs/graphql';

// ── Nested author input (frontend sends { id } object) ────────────────────────
@InputType()
export class UpdateRoadmapAuthorInput {
  @Field(() => ID)
  id: string;
}

// ── Nested tutorial input (frontend sends { id, tutorialName } object) ────────
@InputType()
export class UpdateRoadmapTutorialInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  tutorialName?: string;
}

// ── Node input ─────────────────────────────────────────────────────────────────
@InputType()
export class UpdateRoadmapNodeInput {
  @Field(() => ID, { nullable: true })
  id?: string; // real uuid — present if node already exists in DB

  @Field()
  clientId: string;

  // Accept EITHER tutorialId (flat) OR tutorial (nested object)
  @Field(() => ID, { nullable: true })
  tutorialId?: string;

  @Field(() => UpdateRoadmapTutorialInput, { nullable: true })
  tutorial?: UpdateRoadmapTutorialInput;

  @Field(() => Float)
  positionX: number;

  @Field(() => Float)
  positionY: number;
}

// ── Edge input ─────────────────────────────────────────────────────────────────
@InputType()
export class UpdateRoadmapEdgeInput {
  @Field()
  sourceClientId: string;

  @Field()
  targetClientId: string;
}

// ── Root input ─────────────────────────────────────────────────────────────────
@InputType()
export class UpdateRoadmapInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  // Accept nested author object — only author.id is used if needed
  @Field(() => UpdateRoadmapAuthorInput, { nullable: true })
  author?: UpdateRoadmapAuthorInput;

  @Field(() => [UpdateRoadmapNodeInput], { nullable: true })
  nodes?: UpdateRoadmapNodeInput[];

  @Field(() => [UpdateRoadmapEdgeInput], { nullable: true })
  edges?: UpdateRoadmapEdgeInput[];

  // Allow timestamps to be passed in and silently ignored
  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
