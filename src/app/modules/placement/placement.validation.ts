import { z } from 'zod';

const createPlacementZodSchema = z.object({
  body: z.object({
    department: z.string({ required_error: 'Department is required' }),
    location: z.string({ required_error: 'Location is required' }),
    totalSeats: z.number({ required_error: 'Total seats is required' }),
    filledSeats: z.number().default(0).optional(),
    durationWeeks: z.string({ required_error: 'Duration weeks is required' }),
    deadline: z.string({ required_error: 'Deadline is required' }),
    startDate: z.string({ required_error: 'Start date is required' }),
    requirements: z.string().optional(),
    description: z.string().optional(),
  }),
});

const updatePlacementZodSchema = z.object({
  body: z.object({
    department: z.string().optional(),
    location: z.string().optional(),
    totalSeats: z.number().optional(),
    filledSeats: z.number().optional(),
    durationWeeks: z.string().optional(),
    deadline: z.string().optional(),
    startDate: z.string().optional(),
    requirements: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const PlacementValidation = {
  createPlacementZodSchema,
  updatePlacementZodSchema,
};