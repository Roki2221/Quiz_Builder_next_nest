import { CreateQuizForm } from './create-quiz-form';

/**
 * /create — page shell for the quiz builder form.
 * The actual form logic lives in create-quiz-form.tsx (a Client Component).
 */
export default function CreateQuizPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-2 text-3xl font-bold">Create Quiz</h1>
      <p className="mb-8 text-gray-600">
        Add a title and one or more questions. You can mix boolean, text, and
        checkbox types in the same quiz.
      </p>

      <CreateQuizForm />
    </main>
  );
}
