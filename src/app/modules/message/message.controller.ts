import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MessageService } from './message.service';
import AppError from '../../../errors/AppError';

const createMessage = catchAsync(async (req, res) => {
  const messageData = req.body;
  const result = await MessageService.createMessageToDB(messageData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Message created successfully',
    data: result,
  });
});

const getMessages = catchAsync(async (req, res) => {
  const result = await MessageService.getMessages();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

const getMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MessageService.getMessageById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Message not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message retrieved successfully',
    data: result,
  });
});

const updateMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await MessageService.updateMessage(id, updateData);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Message not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message updated successfully',
    data: result,
  });
});

const deleteMessage = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MessageService.deleteMessage(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Message not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Message deleted successfully',
    data: result,
  });
});

export const MessageController = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
};