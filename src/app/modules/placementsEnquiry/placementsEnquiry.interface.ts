import { Document, Model } from 'mongoose';

export interface IPlacementsEnquiry extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  universityOrMedicalSchool: string;
  yearOfStudy: number;
  preferredStartDate: string;
  duration: string;
  preferredSpecialty: string;
  preferredCities: string;
  language: string;
  documents: string[];
  additionalInformation?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PlacementsEnquiryModel = {
  isExistPlacementsEnquiryById(id: string): any;
} & Model<IPlacementsEnquiry>;