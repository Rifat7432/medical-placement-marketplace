import { Document, Model } from 'mongoose';

export interface IFaq extends Document {
  question: string;
  answer: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FaqModel = {
  isExistFaqById(id: string): any;
} & Model<IFaq>;
