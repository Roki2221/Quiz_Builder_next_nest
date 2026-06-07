import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a quiz and all its questions in one database transaction.
  async create(dto: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: {
        title: dto.title,
        questions: {
          create: dto.questions.map((question) => ({
            type: question.type,
            text: question.text,
            options: question.options ?? [],
          })),
        },
      },
      include: { questions: true },
    });
  }

  // List all quizzes with a count of questions (no full question data).
  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return quizzes.map(({ _count, ...quiz }) => ({
      ...quiz,
      questionCount: _count.questions,
    }));
  }

  // Return one quiz with all its questions.
  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with id "${id}" not found`);
    }

    return quiz;
  }

  // Delete a quiz; Prisma cascade removes related questions automatically.
  async remove(id: string) {
    try {
      return await this.prisma.quiz.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Quiz with id "${id}" not found`);
    }
  }
}
