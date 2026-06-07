import Link from 'next/link';

/**
 * Shown when getQuiz() fails (e.g. quiz id does not exist).
 * Next.js renders this instead of the detail page.
 */
export default function QuizNotFound() {
  return (
    <main className="mx-auto max-w-2xl p-8 text-center">
      <h1 className="text-2xl font-bold">Quiz not found</h1>
      <p className="mt-2 text-gray-600">
        The quiz you are looking for does not exist or was deleted.
      </p>
      <Link
        href="/quizzes"
        className="mt-6 inline-block text-blue-600 hover:underline"
      >
        Back to quizzes
      </Link>
    </main>
  );
}
