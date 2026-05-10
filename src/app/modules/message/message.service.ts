import { StatusCodes } from 'http-status-codes';
import { IMessage } from './message.interface';
import { Message } from './message.model';
import { Conversation } from '../conversation/conversation.model';
import AppError from '../../../errors/AppError';
import { createNotification, notificationMessages } from '../../../helpers/notificationHelper';
import { User } from '../user/user.model';

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

  // Get conversation participants
  if (payload.conversationId) {
    const conversation = await Conversation.findById(payload.conversationId);
    if (conversation) {
      // Find receiver (participant who is not the sender)
      const receiver = conversation.participants.find(
        (id) => id.toString() !== payload.senderId?.toString()
      );

      if (receiver) {
        const senderUser = await User.findById(payload.senderId);
        const receiverUser = await User.findById(receiver);

        // Determine notification type based on user role
        if (senderUser?.role === 'student' && receiverUser?.role === 'hospital') {
          await createNotification({
            receiver: receiver.toString(),
            title: notificationMessages.HOSPITAL_MESSAGE_RECEIVED.title,
            message: `New message from ${senderUser.email}`,
            type: notificationMessages.HOSPITAL_MESSAGE_RECEIVED.type,
          });
        } else if (senderUser?.role === 'hospital' && receiverUser?.role === 'student') {
          await createNotification({
            receiver: receiver.toString(),
            title: notificationMessages.STUDENT_MESSAGE_RECEIVED.title,
            message: `New message from a hospital`,
            type: notificationMessages.STUDENT_MESSAGE_RECEIVED.type,
          });
        }
      }
    }
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
  const message = await Message.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return message;
};

export const MessageService = {
  createMessageToDB,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};