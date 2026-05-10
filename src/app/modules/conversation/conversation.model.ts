import { model, Schema } from 'mongoose';
import { IConversation, ConversationModel } from './conversation.interface';

const conversationSchema = new Schema<IConversation, ConversationModel>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Exist Conversation Check
conversationSchema.statics.isExistConversationById = async (id: string) => {
  return await Conversation.findById(id);
};

// Query Middleware
conversationSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

conversationSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

conversationSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Conversation = model<IConversation, ConversationModel>('Conversation', conversationSchema);