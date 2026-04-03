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

const getMatchingPlacements = catchAsync(async (req, res) => {
     const result = await MatchingPlacementService.getMatchingPlacements();
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Matching placements retrieved successfully',
          data: result,
     });
});

const getMatchingPlacementsByStudent = catchAsync(async (req, res) => {
     const { studentId } = req.params;
     const result = await MatchingPlacementService.getMatchingPlacementsByStudent(studentId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Matching placements retrieved successfully',
          data: result,
     });
});

const getMatchingPlacementsByPlacement = catchAsync(async (req, res) => {
     const { placementId } = req.params;
     const result = await MatchingPlacementService.getMatchingPlacementsByPlacement(placementId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Matching placements retrieved successfully',
          data: result,
     });
});

const getMatchingPlacement = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await MatchingPlacementService.getMatchingPlacementById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Matching placement not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Matching placement retrieved successfully',
          data: result,
     });
});

const getMatchingPlacementByEnquiry = catchAsync(async (req, res) => {
     const { enquiryId } = req.params;
     const result = await MatchingPlacementService.getMatchingPlacementByEnquiry(enquiryId);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Matching placement not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Matching placement retrieved successfully',
          data: result,
     });
});

const updateMatchingPlacement = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updateData = req.body;
     const result = await MatchingPlacementService.updateMatchingPlacement(id, updateData);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Matching placement not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Matching placement updated successfully',
          data: result,
     });
});

const deleteMatchingPlacement = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await MatchingPlacementService.deleteMatchingPlacement(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Matching placement not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Matching placement deleted successfully',
          data: result,
     });
});

export const MatchingPlacementController = {
     createMatchingPlacement,
     getMatchingPlacements,
     getMatchingPlacementsByStudent,
     getMatchingPlacementsByPlacement,
     getMatchingPlacement,
     getMatchingPlacementByEnquiry,
     updateMatchingPlacement,
     deleteMatchingPlacement,
};