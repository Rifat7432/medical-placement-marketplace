import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
     body: z.object({
          status: z.enum(['pending', 'approved', 'rejected'], { required_error: 'Status is required' }),
         
     }),
});

export const adminValidation = {
     createVerifyEmailZodSchema,
};
