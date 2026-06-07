'use client';

/**
 * Client component for the quiz list delete button.
 *
 * We keep delete logic client-side so we can call router.refresh()
 * after deletion to re-fetch the server-rendered quiz list.
 */

import { deleteQuiz } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type DeleteQuizButtonProps = {
  quizId: string;
  quizTitle: string;
};

export function DeleteQuizButton({ quizId, quizTitle }: DeleteQuizButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${quizTitle}"? This cannot be undone.`);
    if (!confirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteQuiz(quizId);
      // Tell Next.js to re-run the server component and reload the list.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
