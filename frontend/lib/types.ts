/**
 * Shared TypeScript types for API responses.
 * These mirror the NestJS backend shapes so pages know what data to expect.
 */

// Matches the Prisma QuestionType enum on the backend.
export type QuestionType = 'BOOLEAN' | 'INPUT' | 'CHECKBOX';

export type Question = {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  options: string[];
};

// Returned by GET /quizzes — list item with a count instead of full questions.
export type QuizSummary = {
  id: string;
  title: string;
  createdAt: string;
  questionCount: number;
};

// Returned by GET /quizzes/:id — full quiz with nested questions.
export type QuizDetail = {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
};

// Payload sent to POST /quizzes when creating a new quiz.
export type CreateQuizPayload = {
  title: string;
  questions: {
    type: QuestionType;
    text: string;
    options?: string[];
  }[];
};
