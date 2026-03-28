import { z } from 'zod';

const createEnquiryZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    message: z.string({ required_error: 'Message is required' }),
  }),
});



export const EnquiryValidation = {
  createEnquiryZodSchema,
};