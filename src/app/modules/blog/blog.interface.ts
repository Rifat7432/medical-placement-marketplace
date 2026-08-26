import { Document, Model } from 'mongoose';

export interface IBlog extends Document {
  image: string;
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogModel = {
  isExistBlogById(id: string): any;
} & Model<IBlog>;
