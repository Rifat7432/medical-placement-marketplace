import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { MatchingPlacementService } from './matchingPlacement.service';
import AppError from '../../../errors/AppError';

const createMatchingPlacement = catchAsync(async (req, res) => {
     const matchingPlacementData = req.body;
     const result = await MatchingPlacementService.createMatchingPlacementToDB(matchingPlacementData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Matching placement created successfully',
          data: result,
     });
});



export const MatchingPlacementController = {
     createMatchingPlacement,
  
};