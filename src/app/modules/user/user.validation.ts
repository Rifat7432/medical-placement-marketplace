import { string, z } from 'zod';
import { USER_ROLES } from '../../../enums/user';

export const createStudentUserZodSchema = z.object({
     body: z.object({
          email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
          password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
          fullName: string().optional(),
     }),
});
export const createHospitalUserZodSchema = z.object({
     body: z.object({
          hospitalName: z.string({ required_error: 'Hospital name is required' }),
          address: z.string({ required_error: 'Address is required' }),
          phone: z.string({ required_error: 'Phone is required' }),
          website: z.string({ required_error: 'Website is required' }),
          description: z.string({ required_error: 'Description is required' }),
          email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
          password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
     }),
});

const updateUserZodSchema = z.object({
     body: z.object({
          name: z.string().optional(),
          phoneNumber: z.string().optional(),
          address: z.string().optional(),
          email: z.string().email('Invalid email address').optional(),
          password: z.string().optional(),
          image: z.string().optional(),
     }),
});

export const googleAuthZodSchema = z.object({
     body: z.object({
          email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
          googleId: z.string({ required_error: 'googleId is required' }),
          name: z.string({ required_error: 'Name is required' }),
          email_verified: z.boolean().optional(),
          picture: z.string().optional(),
          deviceToken: z.string().optional(),
     }),
});

export const appleAuthZodSchema = z.object({
     body: z.object({
          email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
          appleId: z.string({ required_error: 'appleId is required' }),
          fullName: z
               .object({
                    givenName: z.string().optional(),
                    familyName: z.string().optional(),
               })
               .optional(),
          deviceToken: z.string().optional(),
     }),
});

export const UserValidation = {
     createHospitalUserZodSchema,
     createStudentUserZodSchema,
     updateUserZodSchema,
     googleAuthZodSchema,
     appleAuthZodSchema,
};
