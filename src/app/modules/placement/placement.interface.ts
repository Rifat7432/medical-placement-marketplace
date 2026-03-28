import { Document, Model } from 'mongoose';

export interface IPlacement extends Document {
  hospitalId: mongoose.Types.ObjectId;
  department: string;
  location: string;
  totalSeats: number;
  filledSeats: number;
  durationWeeks: string;
  deadline: string;
  startDate: string;
  requirements: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PlacementModel = {
  isExistPlacementById(id: string): any;
} & Model<IPlacement>;