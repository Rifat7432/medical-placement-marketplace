import { StatusCodes } from 'http-status-codes';
import { IConversation } from './conversation.interface';
import { Conversation } from './conversation.model';
import { Message } from '../message/message.model';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';
import AppError from '../../../errors/AppError';


const createConversationToDB = async (payload: Partial<IConversation>, userId: string): Promise<IConversation> => {
  // Check if user is admin
  const user = await User.findById(userId);
  if (!user || user.role !== USER_ROLES.ADMIN) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Only admins can create conversations');
  }

  // Validate participants
  const participants = payload.participants || [];
  if (participants.length === 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'At least one participant is required');
  }

  // Check if all participants exist and have valid roles
  const users = await User.find({ _id: { $in: participants } });
  if (users.length !== participants.length) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Some participants do not exist');
  }

  // Validate role combinations
  const roles = users.map(u => u.role);
  const hasStudent = roles.includes(USER_ROLES.STUDENT);
  const hasHospital = roles.includes(USER_ROLES.HOSPITAL);
  const hasAdmin = roles.includes(USER_ROLES.ADMIN);

  // Students can only be with admins, hospitals with admins, no direct student-hospital
  if ((hasStudent && hasHospital) || (hasStudent && !hasAdmin) || (hasHospital && !hasAdmin)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid participant combination');
  }

  // For now, only 2 participants
  if (participants.length > 2) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Only 2 participants allowed per conversation');
  }

  const conversationData = {
    ...payload,
    participants,
    createdBy: userId,
  };

  const conversation = await Conversation.create(conversationData);
  if (!conversation) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create conversation');
  }
  return conversation;
};

const getConversationsOfUser = async (userId: string): Promise<IConversation[]> => {
  const conversations = await Conversation.find({ participants: userId, isActive: true })
    .populate('participants', 'email role')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
  return conversations;
};

const getMessagesFromConversation = async (conversationId: string, userId: any): Promise<any[]> => {
  // Check if user is participant
  const conversation = await Conversation.findById(conversationId);
  if (!conversation || !conversation.participants.includes(userId)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  const messages = await Message.find({ conversationId })
    .populate('senderId', 'email role')
    .sort({ createdAt: 1 });
  return messages;
};

const updateConversation = async (id: string, payload: Partial<IConversation>, userId: string): Promise<IConversation | null> => {
  // Only creator can update
  const conversation = await Conversation.findById(id);
  if (!conversation || conversation.createdBy.toString() !== userId) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  const updatedConversation = await Conversation.findByIdAndUpdate(id, payload, { new: true });
  return updatedConversation;
};

const deleteConversation = async (id: string, userId: string): Promise<IConversation | null> => {
  // Only creator can delete
  const conversation = await Conversation.findById(id);
  if (!conversation || conversation.createdBy.toString() !== userId) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied');
  }

  const deletedConversation = await Conversation.findByIdAndUpdate(id, { isActive: false }, { new: true });
  return deletedConversation;
};

export const ConversationService = {
  createConversationToDB,
  getConversationsOfUser,
  getMessagesFromConversation,
  updateConversation,
  deleteConversation,
};