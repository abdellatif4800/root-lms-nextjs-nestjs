import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { QuizService } from './quizzes-management.service';
import { QuizType } from './entities/quizzes.graphqlTypes';
import { CreateQuizInput, UpdateQuizInput } from './entities/quizzes.input';

@Resolver(() => QuizType)
export class QuizResolver {
  constructor(private readonly quizService: QuizService) { }

  @Mutation(() => QuizType)
  createQuiz(@Args('input') input: CreateQuizInput) {
    return this.quizService.create(input);
  }

  @Query(() => [QuizType])
  allQuizzes() {
    return this.quizService.findAll();
  }

  @Query(() => QuizType)
  quizById(@Args('id', { type: () => ID }) id: string) {
    return this.quizService.findOne(id);
  }

  @Mutation(() => QuizType)
  updateQuiz(@Args('input') input: UpdateQuizInput) {
    return this.quizService.update(input);
  }

  @Mutation(() => Boolean)
  removeQuiz(@Args('id', { type: () => ID }) id: string) {
    return this.quizService.remove(id);
  }

  @Mutation(() => QuizType)
  toggleQuizPublish(@Args('id', { type: () => ID }) id: string) {
    return this.quizService.togglePublish(id);
  }
}
