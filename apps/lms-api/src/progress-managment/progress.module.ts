import { forwardRef, Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResolver } from './progress.resolver';
import { UnitProgress } from './entities/progress.entity';
import { QuizProgress } from './entities/quiz-progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialsModule } from '../tutorials-management/tutorials.module';
import { QuizzesManagementModule } from '../quizzes-management/quizzes-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitProgress, QuizProgress]),
    forwardRef(() => TutorialsModule),
    forwardRef(() => QuizzesManagementModule),
  ],
  providers: [ProgressResolver, ProgressService],
})
export class ProgressModule {}
