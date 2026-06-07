/**
 * Zod schema for the "Create Quiz" form.
 *
 * Zod runs client-side validation before we send data to the API.
 * React Hook Form connects to this schema via @hookform/resolvers/zod.
 */

import { z } from 'zod';

// Same values as the backend QuestionType enum.
export const QUESTION_TYPES = ['BOOLEAN', 'INPUT', 'CHECKBOX'] as const;

export const questionTypeSchema = z.enum(QUESTION_TYPES);

// Validation rules for a single question row in the dynamic form.
export const questionSchema = z
  .object({
    type: questionTypeSchema,
    text: z.string().trim().min(1, 'Question text is required'),
    // Checkbox questions need options; other types ignore this field.
    options: z.array(z.string().trim().min(1, 'Option cannot be empty')),
  })
  .superRefine((question, context) => {
    // Checkbox questions must have at least one non-empty option.
    if (question.type === 'CHECKBOX' && question.options.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add at least one option for checkbox questions',
        path: ['options'],
      });
    }
  });

// Top-level form shape: a title plus at least one question.
export const quizFormSchema = z.object({
  title: z.string().trim().min(1, 'Quiz title is required'),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

// Infer TypeScript type from the schema — used by React Hook Form.
export type QuizFormValues = z.infer<typeof quizFormSchema>;

// Default empty question appended when the user clicks "Add question".
export const emptyQuestion: QuizFormValues['questions'][number] = {
  type: 'BOOLEAN',
  text: '',
  options: [],
};
