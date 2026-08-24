import { z } from 'zod';

const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    content: z.string({ required_error: 'Content is required' }),
  }),
});

export const BlogValidation = {
  createBlogZodSchema,
};
