import { z } from 'zod';

const createStudentZodSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    phoneNumber: z.string().optional(),
    university: z.string({ required_error: 'University is required' }),
    yearOfStudy: z.number({ required_error: 'Year of study is required' }),
    preferredSpecialty: z.string().optional(),
    preferredCities: z.string().optional(),
    languages: z.string().optional(),
    profileImage: z.string().optional(),
    documents: z.array(z.object({
      name: z.string(),
      url: z.string(),
      type: z.string()
    })).optional(),
  }),
});

const updateStudentZodSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    university: z.string().optional(),
    yearOfStudy: z.number().optional(),
    preferredSpecialty: z.string().optional(),
    preferredCities: z.string().optional(),
    languages: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const StudentValidation = {
  createStudentZodSchema,
  updateStudentZodSchema,
};