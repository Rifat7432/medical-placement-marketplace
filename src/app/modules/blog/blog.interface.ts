import { Document, Model } from 'mongoose';

export interface IBlog extends Document {
  image: string;
  title: string;
  content: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BlogModel = {
  isExistBlogById(id: string): any;
} & Model<IBlog>;
