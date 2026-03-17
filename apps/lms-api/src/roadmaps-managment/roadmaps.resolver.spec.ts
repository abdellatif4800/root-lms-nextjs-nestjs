import { Test, TestingModule } from '@nestjs/testing';
import { RoadmapsResolver } from './roadmaps.resolver';
import { RoadmapsService } from './roadmaps.service';

describe('RoadmapsResolver', () => {
  let resolver: RoadmapsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoadmapsResolver, RoadmapsService],
    }).compile();

    resolver = module.get<RoadmapsResolver>(RoadmapsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
