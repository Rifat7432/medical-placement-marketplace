import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
     body: z.object({
          email: z.string({ required_error: 'Email is required' }),
          oneTimeCode: z.number({ required_error: 'One time code is required' }),
     }),
});

const createLoginZodSchema = z.object({
     body: z.object({
          email: z.string({ required_error: 'Email is required' }),
          password: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
     }),
});

const createForgetPasswordZodSchema = z.object({
     body: z.object({
          email: z.string({ required_error: 'Email is required' }),
     }),
});

const createResetPasswordZodSchema = z.object({
     body: z.object({
          newPassword: z.string({ required_error: 'Password is required' }).min(8, 'Password must be at least 8 characters long'),
          confirmPassword: z
               .string({
                    required_error: 'Confirm Password is required',
               })
               .min(8, 'Password must be at least 8 characters long'),
     }),
});

const createChangePasswordZodSchema = z.object({
     body: z.object({
          currentPassword: z
               .string({
                    required_error: 'Current Password is required',
               })
               .min(8, 'Password must be at least 8 characters long'),
          newPassword: z.string({ required_error: 'New Password is required' }),
          confirmPassword: z
               .string({
                    required_error: 'Confirm Password is required',
               })
               .min(8, 'Password must be at least 8 characters long'),
     }),
});

export const AuthValidation = {
     createVerifyEmailZodSchema,
     createForgetPasswordZodSchema,
     createLoginZodSchema,
     createResetPasswordZodSchema,
     createChangePasswordZodSchema,
};
