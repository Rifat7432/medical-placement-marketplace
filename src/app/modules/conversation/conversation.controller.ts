import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ConversationService } from './conversation.service';
import AppError from '../../../errors/AppError';

const createConversation = catchAsync(async (req, res) => {
  const conversationData = req.body;
  const userId = req.user.id; // Assuming auth middleware sets req.user
  const result = await ConversationService.createConversationToDB(conversationData, userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Conversation created successfully',
    data: result,
  });
});

const getConversations = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await ConversationService.getConversationsOfUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Conversations retrieved successfully',
    data: result,
  });
});

const getMessagesFromConversation = catchAsync(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;
  const result = await ConversationService.getMessagesFromConversation(conversationId, userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

const updateConversation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const userId = req.user.id;
  const result = await ConversationService.updateConversation(id, updateData, userId);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Conversation not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Conversation updated successfully',
    data: result,
  });
});

const deleteConversation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await ConversationService.deleteConversation(id, userId);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Conversation not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Conversation deleted successfully',
    data: result,
  });
});

export const ConversationController = {
  createConversation,
  getConversations,
  getMessagesFromConversation,
  updateConversation,
  deleteConversation,
};