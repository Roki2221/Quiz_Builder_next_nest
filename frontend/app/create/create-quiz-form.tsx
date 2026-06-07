'use client';

/**
 * Client-side form for building a quiz.
 *
 * Key libraries used here:
 * - React Hook Form: manages form state and submission
 * - useFieldArray: adds/removes dynamic question rows
 * - zodResolver: runs our Zod schema on submit and on blur
 */

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
  type UseFormRegister,
  type UseFormSetValue,
} from 'react-hook-form';
import { createQuiz } from '@/lib/api';
import {
  emptyQuestion,
  QUESTION_TYPES,
  quizFormSchema,
  type QuizFormValues,
} from '@/lib/schemas/quiz-form.schema';

export function CreateQuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      questions: [emptyQuestion],
    },
  });

  // useFieldArray gives us append/remove for the questions list.
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  async function onSubmit(values: QuizFormValues) {
    setSubmitError(null);

    try {
      // Strip empty options for non-checkbox types before sending to the API.
      const payload = {
        title: values.title,
        questions: values.questions.map((question) => ({
          type: question.type,
          text: question.text,
          options: question.type === 'CHECKBOX' ? question.options : [],
        })),
      };

      const created = await createQuiz(payload);
      router.push(`/quizzes/${created.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to create quiz');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Quiz title */}
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Quiz title
        </label>
        <input
          id="title"
          {...register('title')}
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="e.g. JavaScript Basics"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Dynamic question list */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Questions</h2>
          <button
            type="button"
            onClick={() => append(emptyQuestion)}
            className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
          >
            + Add question
          </button>
        </div>

        {fields.map((field, index) => (
          <QuestionField
            key={field.id}
            index={index}
            control={control}
            register={register}
            setValue={setValue}
            errors={errors.questions?.[index]}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}

        {errors.questions?.root && (
          <p className="text-sm text-red-600">{errors.questions.root.message}</p>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Create quiz'}
      </button>
    </form>
  );
}

type QuestionFieldProps = {
  index: number;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  setValue: UseFormSetValue<QuizFormValues>;
  errors?: {
    type?: { message?: string };
    text?: { message?: string };
    options?: { message?: string };
  };
  onRemove: () => void;
  canRemove: boolean;
};

/**
 * One question card in the form.
 * Checkbox options are managed with useWatch + setValue (simpler than a nested useFieldArray).
 */
function QuestionField({
  index,
  control,
  register,
  setValue,
  errors,
  onRemove,
  canRemove,
}: QuestionFieldProps) {
  const questionType = useWatch({
    control,
    name: `questions.${index}.type`,
  });

  const options = useWatch({
    control,
    name: `questions.${index}.options`,
  }) ?? [];

  function addOption() {
    setValue(`questions.${index}.options`, [...options, '']);
  }

  function removeOption(optionIndex: number) {
    setValue(
      `questions.${index}.options`,
      options.filter((_, i) => i !== optionIndex),
    );
  }

  return (
    <div className="rounded border border-gray-200 p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-gray-500">Question {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      {/* Question type dropdown */}
      <div>
        <label className="mb-1 block text-sm font-medium">Type</label>
        <select
          {...register(`questions.${index}.type`)}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          {QUESTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type === 'BOOLEAN' && 'Yes / No (Boolean)'}
              {type === 'INPUT' && 'Text input'}
              {type === 'CHECKBOX' && 'Checkbox (multiple choice)'}
            </option>
          ))}
        </select>
      </div>

      {/* Question text */}
      <div>
        <label className="mb-1 block text-sm font-medium">Question text</label>
        <input
          {...register(`questions.${index}.text`)}
          className="w-full rounded border border-gray-300 px-3 py-2"
          placeholder="Enter the question"
        />
        {errors?.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
        )}
      </div>

      {/* Checkbox-only: dynamic list of answer options */}
      {questionType === 'CHECKBOX' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Answer options</label>
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-blue-600 hover:underline"
            >
              + Add option
            </button>
          </div>

          {options.length === 0 && (
            <p className="text-sm text-gray-500">
              No options yet — click &quot;Add option&quot; above.
            </p>
          )}

          {options.map((_, optionIndex) => (
            <div key={optionIndex} className="flex gap-2">
              <input
                {...register(`questions.${index}.options.${optionIndex}`)}
                className="flex-1 rounded border border-gray-300 px-3 py-2"
                placeholder={`Option ${optionIndex + 1}`}
              />
              <button
                type="button"
                onClick={() => removeOption(optionIndex)}
                className="rounded border border-gray-300 px-2 text-sm hover:bg-gray-50"
              >
                ✕
              </button>
            </div>
          ))}

          {errors?.options && (
            <p className="text-sm text-red-600">{errors.options.message}</p>
          )}
        </div>
      )}

      {/* Short hint for boolean/input types */}
      {questionType === 'BOOLEAN' && (
        <p className="text-sm text-gray-500">Respondents will answer Yes or No.</p>
      )}
      {questionType === 'INPUT' && (
        <p className="text-sm text-gray-500">Respondents will type a free-text answer.</p>
      )}
    </div>
  );
}
