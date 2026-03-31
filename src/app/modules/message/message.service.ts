import { StatusCodes } from 'http-status-codes';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import AppError from '../../../errors/AppError';

const createMessageToDB = async (payload: Partial<IMessage>): Promise<IMessage> => {
  // Validate conversation exists and user is participant
  if (payload.conversationId) {
    const conversation = await Conversation.findById(payload.conversationId);
    if (!conversation) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Conversation not found');
    }
    // Note: Auth check in controller or socket
  }

  const message = await Message.create(payload);
  if (!message) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create message');
  }
  return message;
};

const getMessages = async (): Promise<IMessage[]> => {
  const messages = await Message.find();
  return messages;
};

const getMessageById = async (id: string): Promise<IMessage | null> => {
  const message = await Message.findById(id);
  return message;
};

const updateMessage = async (id: string, payload: Partial<IMessage>): Promise<IMessage | null> => {
  const message = await Message.findByIdAndUpdate(id, payload, { new: true });
  return message;
};

const deleteMessage = async (id: string): Promise<IMessage | null> => {
  const message = await Message.findByIdAndDelete(id);
  return message;
};

export const MessageService = {
  createMessageToDB,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};