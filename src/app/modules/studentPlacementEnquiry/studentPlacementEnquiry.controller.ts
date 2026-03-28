import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StudentPlacementEnquiryService } from './studentPlacementEnquiry.service';
import AppError from '../../../errors/AppError';

const createStudentPlacementEnquiry = catchAsync(async (req, res) => {
  const studentPlacementEnquiryData = req.body;
  const result = await StudentPlacementEnquiryService.createStudentPlacementEnquiryToDB(studentPlacementEnquiryData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Student placement enquiry created successfully',
    data: result,
  });
});

const getStudentPlacementEnquiries = catchAsync(async (req, res) => {
  const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiries();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student placement enquiries retrieved successfully',
    data: result,
  });
});

const getStudentPlacementEnquiry = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiryById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student placement enquiry retrieved successfully',
    data: result,
  });
});

const updateStudentPlacementEnquiry = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await StudentPlacementEnquiryService.updateStudentPlacementEnquiry(id, updateData);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student placement enquiry updated successfully',
    data: result,
  });
});

const deleteStudentPlacementEnquiry = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentPlacementEnquiryService.deleteStudentPlacementEnquiry(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student placement enquiry deleted successfully',
    data: result,
  });
});

export const StudentPlacementEnquiryController = {
  createStudentPlacementEnquiry,
  getStudentPlacementEnquiries,
  getStudentPlacementEnquiry,
  updateStudentPlacementEnquiry,
  deleteStudentPlacementEnquiry,
};