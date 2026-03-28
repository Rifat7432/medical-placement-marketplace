import { z } from 'zod';

const createHospitalZodSchema = z.object({
  body: z.object({
    hospitalName: z.string({ required_error: 'Hospital name is required' }),
    address: z.string({ required_error: 'Address is required' }),
    phone: z.string({ required_error: 'Phone is required' }),
    website: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
    totalSeats: z.number().default(0).optional(),
    availableSeats: z.number().default(0).optional(),
  }),
});

const updateHospitalZodSchema = z.object({
  body: z.object({
    hospitalName: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
    totalSeats: z.number().optional(),
    availableSeats: z.number().optional(),
  }),
});

export const HospitalValidation = {
  createHospitalZodSchema,
  updateHospitalZodSchema,
};