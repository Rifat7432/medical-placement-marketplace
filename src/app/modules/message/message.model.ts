import { model, Schema } from 'mongoose';
import { IMessage, MessageModel } from './message.interface';

const messageSchema = new Schema<IMessage, MessageModel>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    content: { type: String, required: true },
    attachments: [{
      url: { type: String },
      type: { type: String }
    }],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Exist Message Check
messageSchema.statics.isExistMessageById = async (id: string) => {
  return await Message.findById(id);
};

// Query Middleware
messageSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

messageSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

messageSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Message = model<IMessage, MessageModel>('Message', messageSchema);