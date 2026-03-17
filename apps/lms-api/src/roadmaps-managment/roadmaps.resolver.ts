import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapType } from './entities/roadmap.graphqlTyes';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => RoadmapType)
export class RoadmapsResolver {
  constructor(private readonly roadmapsService: RoadmapsService) {}

  @Query(() => [RoadmapType], { name: 'roadmaps' })
  async getRoadmaps(): Promise<RoadmapType[]> {
    return this.roadmapsService.getRoadmaps();
  }

  @Query(() => RoadmapType, { name: 'roadmap' })
  async getRoadmap(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RoadmapType> {
    const roadmap = await this.roadmapsService.getRoadmapWithDetails(id);
    if (!roadmap) {
      throw new NotFoundException(`Roadmap with ID ${id} not found`);
    }
    return roadmap;
  }
}
