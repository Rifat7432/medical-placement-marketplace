import { z } from 'zod';

const createPlacementsEnquiryZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    firstName: z.string({ required_error: 'First name is required' }),
    lastName: z.string({ required_error: 'Last name is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    universityOrMedicalSchool: z.string({ required_error: 'University or medical school is required' }),
    yearOfStudy: z.number({ required_error: 'Year of study is required' }),
    preferredStartDate: z.string({ required_error: 'Preferred start date is required' }),
    duration: z.string({ required_error: 'Duration is required' }),
    preferredSpecialty: z.string({ required_error: 'Preferred specialty is required' }),
    preferredCities: z.string({ required_error: 'Preferred cities is required' }),
    language: z.string({ required_error: 'Language is required' }),
    documents: z.array(z.string()).optional(),
    additionalInformation: z.string().optional(),
  }),
});



export const PlacementsEnquiryValidation = {
  createPlacementsEnquiryZodSchema,

};