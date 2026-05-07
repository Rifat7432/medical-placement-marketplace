import { z } from 'zod';

const verifyStatusZodSchema = z.object({
     body: z.object({
          status: z.enum(['pending', 'approved', 'rejected'], { required_error: 'Status is required' }),
         
     }),
});

const matchPlacementZodSchema = z.object({
     body: z.object({
     
          placementIds: z.array(z.string()),
     }),
});

export const adminValidation = {
     verifyStatusZodSchema,
     matchPlacementZodSchema
};
