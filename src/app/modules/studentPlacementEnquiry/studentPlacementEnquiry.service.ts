import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { IStudentPlacementEnquiry } from './studentPlacementEnquiry.interface';
import { StudentPlacementEnquiry } from './studentPlacementEnquiry.model';
import AppError from '../../../errors/AppError';
import { JwtPayload } from 'jsonwebtoken';
import { Placement } from '../placement/placement.model';
import { createNotification, notificationMessages } from '../../../helpers/notificationHelper';
import { User } from '../user/user.model';
import { Hospital } from '../hospital/hospital.model';

const createStudentPlacementEnquiryToDB = async (studentId: string, payload: Partial<IStudentPlacementEnquiry>): Promise<IStudentPlacementEnquiry> => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.create({ ...payload, studentId });
     if (!studentPlacementEnquiry) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create student placement enquiry');
     }

     // Send notification to student
     await createNotification({
          receiver: studentId,
          title: notificationMessages.STUDENT_ENQUIRY_CREATED.title,
          message: notificationMessages.STUDENT_ENQUIRY_CREATED.message,
          type: notificationMessages.STUDENT_ENQUIRY_CREATED.type,
     });

     // Send notification to admin about new enquiry
     const admin = await User.findOne({ role: 'admin' });
     if (admin) {
          await createNotification({
               receiver: admin._id.toString(),
               title: notificationMessages.ADMIN_NEW_ENQUIRY.title,
               message: notificationMessages.ADMIN_NEW_ENQUIRY.message,
               type: notificationMessages.ADMIN_NEW_ENQUIRY.type,
          });
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

          // ✅ NOW you can filter by hospitalId
          {
               $match: {
                    'chosenPlacement.hospitalId': new mongoose.Types.ObjectId(hospitalId),
               },
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

const getStudentPlacementEnquiryByIdForStudent = async (id: string, user: JwtPayload) => {
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

     const studentPlacement = studentPlacementEnquiry.length > 0 ? (studentPlacementEnquiry[0] as IStudentPlacementEnquiry) : null;

     if (studentPlacement?.chosenPlacementId) {
          const chosenPlacement = await Placement.findById(studentPlacement.chosenPlacementId);

          return chosenPlacement;
     }
     return studentPlacement;
};
const getStudentPlacementEnquiryByIdForHospital = async (hospitalId: string, enquiryId: string) => {
     const studentPlacementEnquiries = await StudentPlacementEnquiry.aggregate([
          {
               $match: {
                    _id: new mongoose.Types.ObjectId(enquiryId),
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

          // ✅ NOW you can filter by hospitalId
          {
               $match: {
                    'chosenPlacement.hospitalId': new mongoose.Types.ObjectId(hospitalId),
               },
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
     return studentPlacementEnquiries.length > 0 ? (studentPlacementEnquiries[0] as IStudentPlacementEnquiry) : null;
};
const getStudentPlacementEnquiryByIdForAdmin = async (id: string) => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findById(id);
     if (!studentPlacementEnquiry) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
     }
     if (studentPlacementEnquiry.chosenPlacementId) {
          const chosenPlacement = await Placement.findById(studentPlacementEnquiry.chosenPlacementId);

          return chosenPlacement;
     }
     return studentPlacementEnquiry;
};

const chooseStudentPlacementEnquiry = async (id: string, payload: { placementId: string }): Promise<IStudentPlacementEnquiry | null> => {
     const isPlacementExist = await Placement.findById(payload.placementId);
     if (!isPlacementExist) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }

     const studentPlacementEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { chosenPlacementId: payload.placementId }, { new: true });
     return studentPlacementEnquiry;
};
const updateStudentPlacementEnquiry = async (id: string, payload: Partial<IStudentPlacementEnquiry>): Promise<IStudentPlacementEnquiry | null> => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, payload, { new: true });
     return studentPlacementEnquiry;
};
const updateHospitalStatusPlacementEnquiry = async (id: string, payload: Partial<IStudentPlacementEnquiry>) => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { hospitalStatus: payload.hospitalStatus }, { new: true });
     
     if (studentPlacementEnquiry) {
          // Get placement and hospital details
          const placement = await Placement.findById(studentPlacementEnquiry.chosenPlacementId);
          const hospital = placement ? await Hospital.findById(placement.hospitalId) : null;
          const hospitalUser = hospital ? await User.findById(hospital.userId) : null;

          // Send notification to hospital about student's response
          if (hospitalUser && payload.hospitalStatus === 'approved') {
               await createNotification({
                    receiver: hospitalUser._id.toString(),
                    title: notificationMessages.HOSPITAL_APPLICATION_APPROVED.title,
                    message: 'A student has approved your placement offer. Congratulations!',
                    type: notificationMessages.HOSPITAL_APPLICATION_APPROVED.type,
               });
          } else if (hospitalUser && payload.hospitalStatus === 'rejected') {
               await createNotification({
                    receiver: hospitalUser._id.toString(),
                    title: notificationMessages.HOSPITAL_APPLICATION_REJECTED.title,
                    message: 'A student has declined your placement offer.',
                    type: notificationMessages.HOSPITAL_APPLICATION_REJECTED.type,
               });
          }
     }

     return studentPlacementEnquiry;
};
const deleteStudentPlacementEnquiry = async (id: string): Promise<IStudentPlacementEnquiry | null> => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findByIdAndDelete(id);
     return studentPlacementEnquiry;
};
const sendToHospital = async (id: string): Promise<IStudentPlacementEnquiry | null> => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { isVisibleToHospitals: true }, { new: true });
     
     if (studentPlacementEnquiry) {
          // Send confirmation notification to student
          await createNotification({
               receiver: studentPlacementEnquiry.studentId,
               title: 'Enquiry Sent to Hospitals',
               message: 'Your placement enquiry has been sent to hospitals. Hospitals can now view your profile.',
               type: 'ALERT',
          });
     }

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
     getStudentPlacementEnquiryByIdForAdmin,
     chooseStudentPlacementEnquiry,
     getStudentPlacementEnquiryByIdForHospital,
     updateHospitalStatusPlacementEnquiry,
     sendToHospital,
};
