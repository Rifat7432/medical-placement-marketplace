import mongoose, { Document, Model } from 'mongoose';

export interface IHospital extends Document {
  userId: mongoose.Types.ObjectId;
  hospitalName: string;
  address: string;
  phone: string;
  website?: string;
  description?: string;
  logo?: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: Date;
  updatedAt: Date;
}

export type HospitalModel = {
  isExistHospitalById(id: string): any;
  isExistHospitalByUserId(userId: string): any;
} & Model<IHospital>;