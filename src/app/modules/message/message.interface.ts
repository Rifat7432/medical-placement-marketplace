import mongoose, { Document, Model } from 'mongoose';

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId; // Optional for group chats
  conversationId: mongoose.Types.ObjectId;
  content: string;
  attachments: { url: string; type: string }[];
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageModel = {
  isExistMessageById(id: string): any;
} & Model<IMessage>;