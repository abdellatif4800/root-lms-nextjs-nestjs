import { Query, Resolver } from '@nestjs/graphql';
import { SystemStatsType } from './models/system-stats.graphqlTypes';
import { TutorialsService } from '../tutorials-management/tutorials.service';
import { RoadmapsService } from '../roadmaps-managment/roadmaps.service';
import { QuizService } from '../quizzes-management/quizzes-management.service';

@Resolver(() => SystemStatsType)
export class SystemStatsResolver {
  constructor(
    private readonly tutorialsService: TutorialsService,
    private readonly roadmapsService: RoadmapsService,
    private readonly quizService: QuizService,
  ) {}

  @Query(() => SystemStatsType)
  async getSystemStats(): Promise<SystemStatsType> {
    const [tutorials, roadmapsCount, quizzesCount] = await Promise.all([
      this.tutorialsService.getCounts(),
      this.roadmapsService.getCounts(),
      this.quizService.getCounts(),
    ]);

    return {
      tutorials,
      roadmapsCount,
      quizzesCount,
    };
  }
}
