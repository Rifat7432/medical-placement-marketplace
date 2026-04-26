import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';
import config from '../../../config';



const changeStudentPlacementEnquiryStatus = catchAsync(async (req, res) => {
     const user: any = req.user;
     const { ...passwordData } = req.body;
     const result = await AdminService.changeStudentPlacementEnquiryStatus(user, passwordData);

     sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: 'Your password has been successfully changed', data: result });
});

export const AdminController = { changeStudentPlacementEnquiryStatus};
