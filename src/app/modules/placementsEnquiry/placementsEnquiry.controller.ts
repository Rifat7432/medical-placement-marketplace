import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PlacementsEnquiryService } from './placementsEnquiry.service';
import AppError from '../../../errors/AppError';

const createPlacementsEnquiry = catchAsync(async (req, res) => {
  const placementsEnquiryData = req.body;
  const result = await PlacementsEnquiryService.createPlacementsEnquiryToDB(placementsEnquiryData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Placements enquiry created successfully',
    data: result,
  });
});



export const PlacementsEnquiryController = {
  createPlacementsEnquiry,
 
};