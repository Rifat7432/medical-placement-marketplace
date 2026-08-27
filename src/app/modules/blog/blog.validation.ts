import { z } from 'zod';
import { checkValidID } from '../../../shared/checkValidID';

const createBlogZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    image: z.string({ required_error: 'Image is required' }),
    content: z.string({ required_error: 'Content is required' }),
    slug: z.string({ required_error: 'Slug is required' }),
    metaTitle: z.string({ required_error: 'Meta title is required' }),
    metaDescription: z.string({ required_error: 'Meta description is required' }),
    metaKeywords: z.string({ required_error: 'Meta keywords are required' }),
  }),
});

const updateBlogZodSchema = z.object({
  params: z.object({ id: checkValidID('Invalid blog id') }),
  body: z.object({
    title: z.string().optional(),
    image: z.string().optional(),
    content: z.string().optional(),
    slug: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
  }).refine((body) => Object.keys(body).length > 0, {
    message: 'At least one field is required to update a blog',
  }),
});

const blogIdZodSchema = z.object({
  params: z.object({ id: checkValidID('Invalid blog id') }),
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
  blogIdZodSchema,
};
