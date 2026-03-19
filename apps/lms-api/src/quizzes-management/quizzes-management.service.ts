import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz, Question, QuestionOption } from './entities/quizzes.entity';
import { CreateQuizInput, UpdateQuizInput } from './entities/quizzes.input';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepo: Repository<Quiz>,
    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
    @InjectRepository(QuestionOption)
    private optionRepo: Repository<QuestionOption>,
  ) { }

  // ─── Create ───────────────────────────────────────────────────────────────

  async create(input: CreateQuizInput): Promise<Quiz> {
    const quiz = this.quizRepo.create({
      title: input.title,
      description: input.description,
      passMark: input.passMark,
      timeLimit: input.timeLimit,
      shuffleQuestions: input.shuffleQuestions,
      publish: input.publish,
      questions: input.questions?.map((q, qi) => ({
        text: q.text,
        type: q.type,
        points: q.points,
        order: q.order ?? qi,
        modelAnswer: q.modelAnswer,
        correctBooleanAnswer: q.correctBooleanAnswer,
        options: q.options?.map((o, oi) => ({
          text: o.text,
          isCorrect: o.isCorrect,
          order: o.order ?? oi,
        })),
      })),
    });

    return this.quizRepo.save(quiz);
  }

  // ─── Find all ─────────────────────────────────────────────────────────────

  async findAll(): Promise<Quiz[]> {
    return this.quizRepo.find({
      relations: ['questions', 'questions.options'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCounts() {
    return await this.quizRepo.count();
  }

  // ─── Find one ─────────────────────────────────────────────────────────────

  async findOne(id: string): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });

    if (!quiz) throw new NotFoundException(`Quiz ${id} not found`);

    // sort questions and options by order
    quiz.questions = quiz.questions?.sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );
    quiz.questions?.forEach((q) => {
      q.options = q.options?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    });

    return quiz;
  }

  // ─── Update (full replace of questions) ──────────────────────────────────

  async update(input: UpdateQuizInput): Promise<Quiz> {
    const quiz = await this.findOne(input.id);

    // update top-level fields
    Object.assign(quiz, {
      title: input.title ?? quiz.title,
      description: input.description ?? quiz.description,
      passMark: input.passMark ?? quiz.passMark,
      timeLimit: input.timeLimit ?? quiz.timeLimit,
      shuffleQuestions: input.shuffleQuestions ?? quiz.shuffleQuestions,
      publish: input.publish ?? quiz.publish,
    });

    await this.quizRepo.save(quiz);

    // replace questions entirely if provided
    if (input.questions) {
      // delete existing questions (cascade deletes options too)
      await this.questionRepo.delete({ quizId: input.id });

      // re-insert with new order
      const newQuestions = input.questions.map((q, qi) =>
        this.questionRepo.create({
          text: q.text,
          type: q.type,
          points: q.points,
          order: q.order ?? qi,
          modelAnswer: q.modelAnswer,
          correctBooleanAnswer: q.correctBooleanAnswer,
          quizId: input.id,
          options: q.options?.map((o, oi) =>
            this.optionRepo.create({
              text: o.text,
              isCorrect: o.isCorrect,
              order: o.order ?? oi,
            }),
          ),
        }),
      );

      await this.questionRepo.save(newQuestions);
    }

    return this.findOne(input.id);
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  async remove(id: string): Promise<boolean> {
    const quiz = await this.findOne(id);
    await this.quizRepo.remove(quiz);
    return true;
  }

  // ─── Toggle publish ───────────────────────────────────────────────────────

  async togglePublish(id: string): Promise<Quiz> {
    const quiz = await this.findOne(id);
    quiz.publish = !quiz.publish;
    return this.quizRepo.save(quiz);
  }
}
