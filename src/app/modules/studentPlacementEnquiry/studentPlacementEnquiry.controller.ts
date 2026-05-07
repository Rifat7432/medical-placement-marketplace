import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StudentPlacementEnquiryService } from './studentPlacementEnquiry.service';
import AppError from '../../../errors/AppError';

const createStudentPlacementEnquiry = catchAsync(async (req, res) => {
     const studentPlacementEnquiryData = req.body;
     const studentId = req.user?.id;
     const result = await StudentPlacementEnquiryService.createStudentPlacementEnquiryToDB(studentId, studentPlacementEnquiryData);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Student placement enquiry created successfully',
          data: result,
     });
});

const getStudentPlacementEnquiries = catchAsync(async (req, res) => {
     const studentId = req.user?.id;
     const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiries(studentId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Student placement enquiries retrieved successfully',
          data: result,
     });
});
const getStudentPlacementEnquiriesForHospital = catchAsync(async (req, res) => {
     const hospitalId = req.user?.id;
     const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiriesForHospital(hospitalId);
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Student placement enquiries retrieved successfully',
          data: result,
     });
});
const getStudentPlacementEnquiriesForAdmin = catchAsync(async (req, res) => {
     const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiriesForAdmin();
     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Student placement enquiries retrieved successfully',
          data: result,
     });
});

const getStudentPlacementEnquiryForStudent = catchAsync(async (req, res) => {
     const { id } = req.params;
     const user = req.user;
     const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiryByIdForStudent(id, user);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Student placement enquiry retrieved successfully',
          data: result,
     });
});
const getStudentPlacementEnquiryForHospital = catchAsync(async (req, res) => {
     const { id } = req.params;
     const user = req.user;
     const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiryByIdForHospital(user?.id, id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Applications retrieved successfully',
          data: result,
     });
});
const getStudentPlacementEnquiryForAdmin = catchAsync(async (req, res) => {
     const { id } = req.params;
     const result = await StudentPlacementEnquiryService.getStudentPlacementEnquiryByIdForAdmin(id);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Placement enquiry retrieved successfully',
          data: result,
     });
});

const updateStudentPlacementEnquiry = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updateData = req.body;
     const result = await StudentPlacementEnquiryService.updateStudentPlacementEnquiry(id, updateData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Student placement enquiry updated successfully',
          data: result,
     });
});
const updateHospitalStatusPlacementEnquiry = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updateData = req.body;
     const result = await StudentPlacementEnquiryService.updateHospitalStatusPlacementEnquiry(id, updateData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Student placement enquiry updated successfully',
          data: result,
     });
});
const chooseStudentPlacementEnquiry = catchAsync(async (req, res) => {
     const { id } = req.params;
     const updateData = req.body;
     const result = await StudentPlacementEnquiryService.chooseStudentPlacementEnquiry(id, updateData);

     sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Placement chosen successfully',
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
     getStudentPlacementEnquiriesForAdmin,
     getStudentPlacementEnquiriesForHospital,
     getStudentPlacementEnquiryForStudent,
     getStudentPlacementEnquiryForHospital,
     getStudentPlacementEnquiryForAdmin,
     updateStudentPlacementEnquiry,
     deleteStudentPlacementEnquiry,
     chooseStudentPlacementEnquiry,
     updateHospitalStatusPlacementEnquiry,
};
