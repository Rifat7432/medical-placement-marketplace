import { Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  message: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EnquiryModel = {
  isExistEnquiryById(id: string): any;
} & Model<IEnquiry>;