import { Test, TestingModule } from '@nestjs/testing';
import { QuizzesManagementService } from './quizzes-management.service';

describe('QuizzesManagementService', () => {
  let service: QuizzesManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizzesManagementService],
    }).compile();

    service = module.get<QuizzesManagementService>(QuizzesManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
