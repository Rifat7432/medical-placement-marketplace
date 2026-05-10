import mongoose, { Document, Model } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  fullName?: string;
  phoneNumber?: string;
  university?: string;
  yearOfStudy?: number;
  preferredSpecialty?: string;
  preferredCities?: string;
  languages?: string;
  profileImage?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type StudentModel = {
  isExistStudentById(id: string): any;
  isExistStudentByUserId(userId: string): any;
} & Model<IStudent>;