import { z } from 'zod';

const createMatchingPlacementZodSchema = z.object({
     body: z.object({
          studentId: z.string({ required_error: 'Student ID is required' }),
          placementId: z.string({ required_error: 'Placement ID is required' }),
          enqueryId: z.string({ required_error: 'Enquiry ID is required' }),
     }),
});

const updateMatchingPlacementZodSchema = z.object({
     body: z.object({
          studentId: z.string().optional(),
          placementId: z.string().optional(),
          enqueryId: z.string().optional(),
     }),
});

export const MatchingPlacementValidation = {
     createMatchingPlacementZodSchema,
     updateMatchingPlacementZodSchema,
};