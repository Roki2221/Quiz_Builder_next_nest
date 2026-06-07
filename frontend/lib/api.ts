/**
 * Simple fetch helpers for talking to the NestJS backend.
 * All pages import from here so the API base URL lives in one place.
 */

import type { CreateQuizPayload, QuizDetail, QuizSummary } from './types';

// Read from .env.local — falls back to local dev default if missing.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/** GET /quizzes — fetch all quizzes for the list page. */
export async function getQuizzes(): Promise<QuizSummary[]> {
  const response = await fetch(`${API_URL}/quizzes`, { cache: 'no-store' });
  return handleResponse<QuizSummary[]>(response);
}

/** GET /quizzes/:id — fetch one quiz with its questions. */
export async function getQuiz(id: string): Promise<QuizDetail> {
  const response = await fetch(`${API_URL}/quizzes/${id}`, { cache: 'no-store' });
  return handleResponse<QuizDetail>(response);
}

/** POST /quizzes — create a new quiz from the form payload. */
export async function createQuiz(payload: CreateQuizPayload): Promise<QuizDetail> {
  const response = await fetch(`${API_URL}/quizzes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse<QuizDetail>(response);
}

/** DELETE /quizzes/:id — remove a quiz (questions are deleted by cascade). */
export async function deleteQuiz(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/quizzes/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Delete failed with status ${response.status}`);
  }
}
