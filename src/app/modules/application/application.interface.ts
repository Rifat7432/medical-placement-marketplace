import { Document, Model } from 'mongoose';

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  placementId?: mongoose.Types.ObjectId;
  enquiryId?: mongoose.Types.ObjectId;
  program: string;
  status: string;
  paymentStatus: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationModel = {
  isExistApplicationById(id: string): any;
} & Model<IApplication>;