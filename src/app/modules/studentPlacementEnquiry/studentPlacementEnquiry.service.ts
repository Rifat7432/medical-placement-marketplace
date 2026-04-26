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
     const studentPlacementEnquiries = await StudentPlacementEnquiry.aggregate([
          {
               $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: 'userId',
                    pipeline: [
                         {
                              $project: {
                                   _id: 1,
                                   fullName: 1,
                                   phoneNumber: 1,
                                   university: 1,
                                   yearOfStudy: 1,
                                   preferredCities: 1,
                                   preferredSpecialty: 1,
                                   languages: 1,
                                   profileImage: 1,
                                   // include only the fields you need
                              },
                         },
                    ],
                    as: 'studentProfile',
               },
          },
          {
               $unwind: '$studentProfile',
          },
          {
               $lookup: {
                    from: 'users',
                    localField: 'studentId',
                    foreignField: '_id',
                    pipeline: [
                         {
                              $project: {
                                   _id: 1,
                                   email: 1,
                                   role: 1,
                                   // include only the fields you need
                              },
                         },
                    ],
                    as: 'studentUser',
               },
          },
          {
               $unwind: '$studentUser',
          },
     ]);
     return studentPlacementEnquiries;
};
const getStudentPlacementEnquiriesForHospital = async (hospitalId: string): Promise<IStudentPlacementEnquiry[]> => {
     const studentPlacementEnquiries = await StudentPlacementEnquiry.aggregate([
          {
               $match: {
                    'chosenPlacementId': { $exists: true, $ne: null },
                    'chosenPlacement.hospitalId': new mongoose.Types.ObjectId(hospitalId),
               },
          },
          {
               $lookup: {
                    from: 'placements',
                    localField: 'chosenPlacementId',
                    foreignField: '_id',
                    pipeline: [
                         {
                              $project: {
                                   _id: 1,
                                   department: 1,
                                   status: 1,
                                   durationWeeks: 1,
                                   deadline: 1,
                                   startDate: 1,
                              },
                         },
                    ],
                    as: 'chosenPlacement',
               },
          },
          {
               $unwind: '$chosenPlacement',
          },
          {
               $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: 'userId',
                    pipeline: [
                         {
                              $project: {
                                   _id: 1,
                                   fullName: 1,
                                   phoneNumber: 1,
                                   university: 1,
                                   yearOfStudy: 1,
                                   preferredCities: 1,
                                   preferredSpecialty: 1,
                                   languages: 1,
                                   profileImage: 1,
                                   // include only the fields you need
                              },
                         },
                    ],
                    as: 'studentProfile',
               },
          },
          {
               $unwind: '$studentProfile',
          },
     ]);
     return studentPlacementEnquiries as IStudentPlacementEnquiry[];
};

const getStudentPlacementEnquiryByIdForStudent = async (id: string, user: JwtPayload): Promise<IStudentPlacementEnquiry | null> => {
     console.log(user, id);
     const studentPlacementEnquiry = await StudentPlacementEnquiry.aggregate([
          {
               $match: { _id: new mongoose.Types.ObjectId(id) },
          },
          {
               $lookup: {
                    from: 'users',
                    localField: 'studentId',
                    foreignField: '_id',
                    pipeline: [
                         {
                              $project: {
                                   _id: 1,
                                   email: 1,
                                   role: 1,
                                   // include only the fields you need
                              },
                         },
                    ],
                    as: 'studentUser',
               },
          },
          {
               $unwind: { path: '$studentUser', preserveNullAndEmptyArrays: true },
          },
          {
               $lookup: {
                    from: 'students',
                    localField: 'studentId',
                    foreignField: 'userId',
                    as: 'studentData',
               },
          },
          {
               $unwind: { path: '$studentData', preserveNullAndEmptyArrays: true },
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
                                   as: 'hospitalData',
                              },
                         },
                         {
                              $unwind: { path: '$hospitalData', preserveNullAndEmptyArrays: true },
                         },
                    ],
               },
          },
          {
               $unwind: { path: '$chosenPlacementData', preserveNullAndEmptyArrays: true },
          },
          {
               $lookup: {
                    from: 'matchingplacements',
                    let: { studentId: '$studentId', enquiryId: '$_id' },
                    pipeline: [
                         {
                              $match: {
                                   $expr: {
                                        $and: [{ $eq: ['$studentId', '$$studentId'] }, { $eq: ['$enquiryId', '$$enquiryId'] }, { $ne: ['$isDeleted', true] }],
                                   },
                              },
                         },
                         {
                              $lookup: {
                                   from: 'placements',
                                   localField: 'placementId',
                                   foreignField: '_id',
                                   as: 'placementDetails',
                                   pipeline: [
                                        {
                                             $lookup: {
                                                  from: 'hospitals',
                                                  localField: 'hospitalId',
                                                  foreignField: '_id',
                                                  as: 'hospitalData',
                                             },
                                        },
                                        {
                                             $unwind: { path: '$hospitalData', preserveNullAndEmptyArrays: true },
                                        },
                                   ],
                              },
                         },
                         {
                              $unwind: { path: '$placementDetails', preserveNullAndEmptyArrays: true },
                         },
                    ],
                    as: 'matchingPlacements',
               },
          },
          {
               $addFields: {
                    matchingPlacements: {
                         $cond: {
                              if: { $in: ['$stage', ['matching required', 'awaiting response']] },
                              then: '$matchingPlacements',
                              else: [],
                         },
                    },
               },
          },
     ]);

     return studentPlacementEnquiry.length > 0 ? (studentPlacementEnquiry[0] as IStudentPlacementEnquiry) : null;
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
     getStudentPlacementEnquiryByIdForStudent,
     updateStudentPlacementEnquiry,
     deleteStudentPlacementEnquiry,
};
