import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getQuiz } from '@/lib/api';
import type { QuestionType } from '@/lib/types';

type QuizDetailPageProps = {
  params: Promise<{ id: string }>;
};

/** Human-readable labels for each question type on the read-only view. */
const typeLabels: Record<QuestionType, string> = {
  BOOLEAN: 'Yes / No',
  INPUT: 'Text input',
  CHECKBOX: 'Checkbox',
};

/**
 * /quizzes/[id] — read-only page showing quiz title and question structure.
 * Fetches fresh data from the API on each request (no caching).
 */
export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  let quiz;

  try {
    quiz = await getQuiz(id);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link href="/quizzes" className="text-sm text-blue-600 hover:underline">
        ← Back to quizzes
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{quiz.title}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Created {new Date(quiz.createdAt).toLocaleString()}
      </p>

      <section className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold">Questions</h2>

        {quiz.questions.length === 0 ? (
          <p className="text-gray-600">This quiz has no questions.</p>
        ) : (
          <ol className="space-y-4">
            {quiz.questions.map((question, index) => (
              <li
                key={question.id}
                className="rounded border border-gray-200 p-4"
              >
                <p className="text-sm text-gray-500">
                  Question {index + 1} · {typeLabels[question.type]}
                </p>
                <p className="mt-1 font-medium">{question.text}</p>

                {/* Show checkbox options as a bullet list */}
                {question.type === 'CHECKBOX' && question.options.length > 0 && (
                  <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                    {question.options.map((option) => (
                      <li key={option}>{option}</li>
                    ))}
                  </ul>
                )}

                {question.type === 'BOOLEAN' && (
                  <p className="mt-2 text-sm text-gray-500">Answer: Yes / No</p>
                )}

                {question.type === 'INPUT' && (
                  <p className="mt-2 text-sm text-gray-500">
                    Answer: free-text field
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
