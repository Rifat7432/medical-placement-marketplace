import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { EnquiryService } from './enquiry.service';
import AppError from '../../../errors/AppError';

const createEnquiry = catchAsync(async (req, res) => {
  const enquiryData = req.body;
  const result = await EnquiryService.createEnquiryToDB(enquiryData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Enquiry created successfully',
    data: result,
  });
});


export const EnquiryController = {
  createEnquiry,
};