import { Document, Model } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  content: string;
  attachments: { url: string; type: string }[];
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageModel = {
  isExistMessageById(id: string): any;
} & Model<IMessage>;