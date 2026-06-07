import Link from 'next/link';
import { getQuizzes } from '@/lib/api';
import { DeleteQuizButton } from './delete-quiz-button';

/**
 * /quizzes — server component that fetches and displays all quizzes.
 *
 * Data fetching happens on the server (no loading spinner needed on first paint).
 * Delete is handled by a small client component that refreshes this page after success.
 */
export default async function QuizzesPage() {
  let quizzes;

  try {
    quizzes = await getQuizzes();
  } catch {
    return (
      <main className="mx-auto max-w-2xl p-8">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="mt-4 text-red-600">
          Could not load quizzes. Make sure the backend is running on port 3001.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <Link
          href="/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          + New quiz
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-gray-600">
          No quizzes yet.{' '}
          <Link href="/create" className="text-blue-600 hover:underline">
            Create your first one
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {quiz.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''}{' '}
                  · {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </div>

              <DeleteQuizButton quizId={quiz.id} quizTitle={quiz.title} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
