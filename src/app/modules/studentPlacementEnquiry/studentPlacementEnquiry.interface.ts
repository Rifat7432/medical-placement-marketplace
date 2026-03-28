import { Document, Model } from 'mongoose';

export interface IStudentPlacementEnquiry extends Document {
  studentId: mongoose.Types.ObjectId;
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

export type StudentPlacementEnquiryModel = {
  isExistStudentPlacementEnquiryById(id: string): any;
} & Model<IStudentPlacementEnquiry>;