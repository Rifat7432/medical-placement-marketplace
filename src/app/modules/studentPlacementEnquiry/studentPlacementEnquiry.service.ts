import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { IStudentPlacementEnquiry } from './studentPlacementEnquiry.interface';
import { StudentPlacementEnquiry } from './studentPlacementEnquiry.model';
import AppError from '../../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';

const createStudentPlacementEnquiryToDB = async (studentId: string, payload: Partial<IStudentPlacementEnquiry>): Promise<IStudentPlacementEnquiry> => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.create({ ...payload, studentId });
     if (!studentPlacementEnquiry) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student placement enquiry');
     }
     return studentPlacementEnquiry;
};

const getStudentPlacementEnquiries = async (studentId: string): Promise<IStudentPlacementEnquiry[]> => {
     const studentPlacementEnquiries = await StudentPlacementEnquiry.find({ studentId });
     return studentPlacementEnquiries;
};
const getStudentPlacementEnquiriesForAdmin = async (): Promise<IStudentPlacementEnquiry[]> => {
     const studentPlacementEnquiries = await StudentPlacementEnquiry.find();
     return studentPlacementEnquiries;
};
const getStudentPlacementEnquiriesForHospital = async (hospitalId: string): Promise<IStudentPlacementEnquiry[]> => {
     const studentPlacementEnquiries = await StudentPlacementEnquiry.aggregate([
          {
               $match: {
                    chosenPlacementId: { $exists: true, $ne: null },
               },
          },
          {
               $lookup: {
                    from: 'placements',
                    localField: 'chosenPlacementId',
                    foreignField: '_id',
                    as: 'chosenPlacement',
               },
          },
          {
               $unwind: '$chosenPlacement',
          },
          {
               $match: {
                    'chosenPlacement.hospitalId': new mongoose.Types.ObjectId(hospitalId),
               },
          },
     ]);
     return studentPlacementEnquiries as IStudentPlacementEnquiry[];
};

const getStudentPlacementEnquiryById = async (id: string, user: JwtPayload): Promise<IStudentPlacementEnquiry | null> => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.aggregate([
          {
               $match: { _id: new mongoose.Types.ObjectId(id) }
          },
          {
               $lookup: {
                    from: 'users',
                    localField: 'studentId',
                    foreignField: '_id',
                    as: 'studentUser'
               }
          },
          {
               $unwind: { path: '$studentUser', preserveNullAndEmptyArrays: true }
          },
          {
               $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: 'userId',
                    as: 'studentData'
               }
          },
          {
               $unwind: { path: '$studentData', preserveNullAndEmptyArrays: true }
          },
          {
               $lookup: {
                    from: 'placements',
                    localField: 'placementId',
                    foreignField: '_id',
                    as: 'placementData',
                    pipeline: [
                         {
                              $lookup: {
                                   from: 'hospitals',
                                   localField: 'hospitalId',
                                   foreignField: '_id',
                                   as: 'hospitalData'
                              }
                         },
                         {
                              $unwind: { path: '$hospitalData', preserveNullAndEmptyArrays: true }
                         }
                    ]
               }
          },
          {
               $lookup: {
                    from: 'placements',
                    localField: 'chosenPlacementId',
                    foreignField: '_id',
                    as: 'chosenPlacementData',
                    pipeline: [
                         {
                              $lookup: {
                                   from: 'hospitals',
                                   localField: 'hospitalId',
                                   foreignField: '_id',
                                   as: 'hospitalData'
                              }
                         },
                         {
                              $unwind: { path: '$hospitalData', preserveNullAndEmptyArrays: true }
                         }
                    ]
               }
          },
          {
               $unwind: { path: '$chosenPlacementData', preserveNullAndEmptyArrays: true }
          }
     ]);

     return studentPlacementEnquiry.length > 0 ? studentPlacementEnquiry[0] as IStudentPlacementEnquiry : null;
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
     getStudentPlacementEnquiriesForAdmin,
     getStudentPlacementEnquiriesForHospital,
     getStudentPlacementEnquiryById,
     updateStudentPlacementEnquiry,
     deleteStudentPlacementEnquiry,
};
