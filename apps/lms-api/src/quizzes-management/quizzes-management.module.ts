import { Module } from '@nestjs/common';
import { QuizService } from './quizzes-management.service';
import { QuizResolver } from './quizzes-management.resolver';
import { Question, QuestionOption, Quiz } from './entities/quizzes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question, QuestionOption])],
  providers: [QuizService, QuizResolver],
  exports: [QuizService, TypeOrmModule],
})
export class QuizzesManagementModule { }
