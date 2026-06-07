import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-8">
      <h1 className="text-3xl font-bold">Quiz Builder</h1>
      <p className="text-gray-600">
        Create quizzes with boolean, text input, and checkbox questions.
      </p>
      <div className="flex gap-4">
        <Link
          href="/create"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Quiz
        </Link>
        <Link
          href="/quizzes"
          className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          View Quizzes
        </Link>
      </div>
    </main>
  );
}
