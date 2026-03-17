import { Test, TestingModule } from '@nestjs/testing';
import { TutorialsResolver } from './tutorials.resolver';
import { TutorialsService } from './tutorials.service';

describe('TutorialsResolver', () => {
  let resolver: TutorialsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TutorialsResolver, TutorialsService],
    }).compile();

    resolver = module.get<TutorialsResolver>(TutorialsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
