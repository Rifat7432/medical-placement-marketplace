import { z } from 'zod';

const verifyStatusZodSchema = z.object({
     body: z.object({
          status: z.enum(['pending', 'approved', 'rejected'], { required_error: 'Status is required' }),
         
     }),
});

export const adminValidation = {
     verifyStatusZodSchema,
};
