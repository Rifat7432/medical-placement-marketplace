import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StudentService } from './student.service';
import AppError from '../../../errors/AppError';

const createStudent = catchAsync(async (req, res) => {
  const studentData = req.body;
  const result = await StudentService.createStudentToDB(studentData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Student created successfully',
    data: result,
  });
});

const getStudents = catchAsync(async (req, res) => {
  const result = await StudentService.getStudents();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Students retrieved successfully',
    data: result,
  });
});

const getStudentProfile = catchAsync(async (req, res) => {
  const user: any = req.user;
  const result = await StudentService.getStudentProfileFromDB(user.id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student retrieved successfully',
    data: result,
  });
});
const getStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getStudentById(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student retrieved successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.user;
  const updateData = req.body;
  const result = await StudentService.updateStudent(id, updateData);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student updated successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.deleteStudent(id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Student not found');
  }
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Student deleted successfully',
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,


  getStudentProfile
};