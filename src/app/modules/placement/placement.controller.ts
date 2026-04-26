import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PlacementService } from './placement.service';
import AppError from '../../../errors/AppError';

const createPlacement = catchAsync(async (req, res) => {
     const placementData = req.body;
     const user: any = req.user;
     const result = await PlacementService.createPlacementToDB(placementData, user.id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Placement created successfully',
          data: result,
     });
});

const getPlacements = catchAsync(async (req, res) => {
     const user: any = req.user;
     const result = await PlacementService.getPlacements(user.id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Placements retrieved successfully',
          data: result,
     });
});

const getPlacement = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await PlacementService.getPlacementById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Placement retrieved successfully',
          data: result,
     });
});
const getPlacementsOfHospital = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await PlacementService.getPlacementsOfHospital(id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Placements retrieved successfully',
          data: result,
     });
});

const updatePlacement = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updateData = req.body;
     const result = await PlacementService.updatePlacement(id, updateData);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Placement updated successfully',
          data: result,
     });
});

const deletePlacement = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await PlacementService.deletePlacement(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Placement deleted successfully',
          data: result,
     });
});

export const PlacementController = {
     createPlacement,
     getPlacements,
     getPlacement,
     updatePlacement,
     deletePlacement,
     getPlacementsOfHospital,
};
