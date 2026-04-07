import mongoose, { Document, Model } from 'mongoose';

export interface IPlacement extends Document {
  hospitalId: mongoose.Types.ObjectId;
  department: string;
  location: string;
  totalSeats: number;
  status: 'available' | 'filled' | 'closed';
  filledSeats: number;
  durationWeeks: string;
  deadline: string;
  startDate: string;
  requirements: string;
  description: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PlacementModel = {
  isExistPlacementById(id: string): any;
} & Model<IPlacement>;