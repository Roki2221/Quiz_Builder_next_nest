import { QuestionType } from '../../../generated/prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

// DTO for a single question inside the create-quiz payload.
export class CreateQuestionDto {
  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  text: string;

  // Checkbox questions must have at least one option; others can omit options.
  @ValidateIf((question: CreateQuestionDto) => question.type === QuestionType.CHECKBOX)
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  options?: string[];
}

// DTO for POST /quizzes — validates title and nested questions array.
export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
