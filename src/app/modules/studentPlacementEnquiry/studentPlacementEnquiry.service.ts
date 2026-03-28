import { StatusCodes } from 'http-status-codes';
import { IStudentPlacementEnquiry } from './studentPlacementEnquiry.interface';
import { StudentPlacementEnquiry } from './studentPlacementEnquiry.model';
import AppError from '../../../errors/AppError';

const createStudentPlacementEnquiryToDB = async (payload: Partial<IStudentPlacementEnquiry>): Promise<IStudentPlacementEnquiry> => {
  const studentPlacementEnquiry = await StudentPlacementEnquiry.create(payload);
  if (!studentPlacementEnquiry) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student placement enquiry');
  }
  return studentPlacementEnquiry;
};

const getStudentPlacementEnquiries = async (): Promise<IStudentPlacementEnquiry[]> => {
  const studentPlacementEnquiries = await StudentPlacementEnquiry.find();
  return studentPlacementEnquiries;
};

const getStudentPlacementEnquiryById = async (id: string): Promise<IStudentPlacementEnquiry | null> => {
  const studentPlacementEnquiry = await StudentPlacementEnquiry.findById(id);
  return studentPlacementEnquiry;
};

const updateStudentPlacementEnquiry = async (id: string, payload: Partial<IStudentPlacementEnquiry>): Promise<IStudentPlacementEnquiry | null> => {
  const studentPlacementEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, payload, { new: true });
  return studentPlacementEnquiry;
};

const deleteStudentPlacementEnquiry = async (id: string): Promise<IStudentPlacementEnquiry | null> => {
  const studentPlacementEnquiry = await StudentPlacementEnquiry.findByIdAndDelete(id);
  return studentPlacementEnquiry;
};

export const StudentPlacementEnquiryService = {
  createStudentPlacementEnquiryToDB,
  getStudentPlacementEnquiries,
  getStudentPlacementEnquiryById,
  updateStudentPlacementEnquiry,
  deleteStudentPlacementEnquiry,
};