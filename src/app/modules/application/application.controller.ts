import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ApplicationService } from './application.service';
import AppError from '../../../errors/AppError';

const createApplication = catchAsync(async (req, res) => {
  const applicationData = req.body;
  const result = await ApplicationService.createApplicationToDB(applicationData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Application created successfully',
    data: result,
  });
});

const getApplications = catchAsync(async (req, res) => {
  const result = await ApplicationService.getApplications();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Applications retrieved successfully',
    data: result,
  });
});

const getApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ApplicationService.getApplicationById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Application not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Application retrieved successfully',
    data: result,
  });
});

const updateApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await ApplicationService.updateApplication(id, updateData);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Application not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Application updated successfully',
    data: result,
  });
});

const deleteApplication = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ApplicationService.deleteApplication(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Application not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Application deleted successfully',
    data: result,
  });
});

export const ApplicationController = {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
};