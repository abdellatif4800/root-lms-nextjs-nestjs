import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesManagementResolver } from './quizzes-management.resolver';
import { QuizzesManagementService } from './quizzes-management.service';

describe('QuizzesManagementResolver', () => {
  let resolver: QuizzesManagementResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizzesManagementResolver, QuizzesManagementService],
    }).compile();

    resolver = module.get<QuizzesManagementResolver>(QuizzesManagementResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
