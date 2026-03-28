import { z } from 'zod';

const createApplicationZodSchema = z.object({
  body: z.object({
    placementId: z.string().optional(),
    enquiryId: z.string().optional(),
    program: z.string({ required_error: 'Program is required' }),
    status: z.string().default('pending').optional(),
    paymentStatus: z.array(z.string()).optional(),
  }),
});

const updateApplicationZodSchema = z.object({
  body: z.object({
    placementId: z.string().optional(),
    enquiryId: z.string().optional(),
    program: z.string().optional(),
    status: z.string().optional(),
    paymentStatus: z.array(z.string()).optional(),
  }),
});

export const ApplicationValidation = {
  createApplicationZodSchema,
  updateApplicationZodSchema,
};