import { z } from 'zod';
import { checkValidID } from '../../../shared/checkValidID';

const createFaqZodSchema = z.object({
  body: z.object({
    category: z.string({ required_error: 'Category is required' }),
    question: z.string({ required_error: 'Question is required' }),
    answer: z.string({ required_error: 'Answer is required' }),
  }),
});

const updateFaqZodSchema = z.object({
  params: z.object({ id: checkValidID('Invalid FAQ id') }),
  body: z.object({
    category: z.string().optional(),
    question: z.string().optional(),
    answer: z.string().optional(),
  }).refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field is required to update an FAQ',
  }),
});

const faqIdZodSchema = z.object({
  params: z.object({ id: checkValidID('Invalid FAQ id') }),
});

export const FaqValidation = {
  createFaqZodSchema,
  updateFaqZodSchema,
  faqIdZodSchema,
};
