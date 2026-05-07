import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { HospitalService } from './hospital.service';
import AppError from '../../../errors/AppError';

const getHospitals = catchAsync(async (req, res) => {
     const result = await HospitalService.getHospitals();
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Hospitals retrieved successfully',
          data: result,
     });
});

const getHospitalProfile = catchAsync(async (req, res) => {
     const user: any = req.user;
     const result = await HospitalService.getHospitalProfile(user.id);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Hospital profile retrieved successfully',
          data: result,
     });
});

const getHospital = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await HospitalService.getHospitalById(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Hospital not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Hospital retrieved successfully',
          data: result,
     });
});

const updateHospital = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updateData = req.body;
     const result = await HospitalService.updateHospital(id, updateData);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Hospital not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Hospital updated successfully',
          data: result,
     });
});

const deleteHospital = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await HospitalService.deleteHospital(id);
     if (!result) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Hospital not found');
     }
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Hospital deleted successfully',
          data: result,
     });
});
const hospitalOverview = catchAsync(async (req, res) => {
     const result = await HospitalService.hospitalOverview(req.user.id);

     sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Hospital overview retrieved successfully', data: result });
});
export const HospitalController = {
     getHospitals,
     getHospital,
     updateHospital,
     deleteHospital,

     getHospitalProfile,
     hospitalOverview,
};
