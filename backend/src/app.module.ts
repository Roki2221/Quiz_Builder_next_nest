import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [PrismaModule, QuizModule],
})
export class AppModule {}
