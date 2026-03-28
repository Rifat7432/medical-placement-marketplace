import { StatusCodes } from 'http-status-codes';
import { IStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../../errors/AppError';

const createStudentToDB = async (payload: Partial<IStudent>): Promise<IStudent> => {
  const student = await Student.create(payload);
  if (!student) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student');
  }
  return student;
};

const getStudents = async (): Promise<IStudent[]> => {
  const students = await Student.find();
  return students;
};

const getStudentById = async (id: string): Promise<IStudent | null> => {
  const student = await Student.findById(id);
  return student;
};

const updateStudent = async (id: string, payload: Partial<IStudent>): Promise<IStudent | null> => {
  const student = await Student.findByIdAndUpdate(id, payload, { new: true });
  return student;
};

const deleteStudent = async (id: string): Promise<IStudent | null> => {
  const student = await Student.findByIdAndDelete(id);
  return student;
};

export const StudentService = {
  createStudentToDB,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};