import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { StudentPlacementEnquiry } from '../studentPlacementEnquiry/studentPlacementEnquiry.model';
import { Notification } from '../notification/notification.model';
import { Hospital } from '../hospital/hospital.model';
import { Placement } from '../placement/placement.model';
import { Payment } from '../payment/payment.model';
import { MatchingPlacement } from '../matching/matchingPlacement.model';
import { IHospital } from '../hospital/hospital.interface';
import { IPlacement } from '../placement/placement.interface';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';
import { createNotification, notificationMessages } from '../../../helpers/notificationHelper';

const changeStudentPlacementEnquiryStatus = async (id: string, payload: Partial<{ status: 'pending' | 'approved' | 'rejected' }>) => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findById(id);
     if (!studentPlacementEnquiry || studentPlacementEnquiry.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
     }

     if (payload.status === 'rejected') {
          const updatedEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { adminStatus: payload.status, stage: 'rejected', studentStatus: 'rejected' }, { new: true });
          
          // Send rejection notification to student
          await createNotification({
               receiver: studentPlacementEnquiry.studentId,
               title: notificationMessages.STUDENT_ENQUIRY_REJECTED.title,
               message: notificationMessages.STUDENT_ENQUIRY_REJECTED.message,
               type: notificationMessages.STUDENT_ENQUIRY_REJECTED.type,
          });

          return updatedEnquiry;
     }
     if (payload.status === 'approved') {
          const updatedEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { adminStatus: payload.status, stage: 'awaiting for payment', studentStatus: 'approved' }, { new: true });
          
          // Send approval notification to student
          await createNotification({
               receiver: studentPlacementEnquiry.studentId,
               title: notificationMessages.STUDENT_ENQUIRY_APPROVED.title,
               message: notificationMessages.STUDENT_ENQUIRY_APPROVED.message,
               type: notificationMessages.STUDENT_ENQUIRY_APPROVED.type,
          });

          return updatedEnquiry;
     }
};
const changeStudentPlacementEnquiryStage = async (id: string) => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findById(id);
     if (!studentPlacementEnquiry || studentPlacementEnquiry.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
     }

     const updatedEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { stage: 'matching required', studentStatus: 'matching' }, { new: true });
     
     // Send matching started notification to student
     await createNotification({
          receiver: studentPlacementEnquiry.studentId,
          title: notificationMessages.STUDENT_MATCHING_STARTED.title,
          message: notificationMessages.STUDENT_MATCHING_STARTED.message,
          type: notificationMessages.STUDENT_MATCHING_STARTED.type,
     });

     return updatedEnquiry;
};
const matchPlacement = async (enquiryId: string, payload: { placementIds: string[]; finalPaymentAmount: number }) => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findById(enquiryId);
     if (!studentPlacementEnquiry || studentPlacementEnquiry.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
     }
     if (studentPlacementEnquiry.firstPayment !== 'paid') {
          throw new AppError(StatusCodes.BAD_REQUEST, 'First payment not completed yet');
     }

     // Process placements with proper async/await
     for (const placementId of payload.placementIds) {
          const placement = await Placement.findById(placementId);
          if (!placement || placement.isDeleted) {
               continue;
          } else {
               const newMatchingPlacement = await MatchingPlacement.create({
                    studentId: studentPlacementEnquiry.studentId,
                    placementId: placement._id,
                    enquiryId: studentPlacementEnquiry._id,
               });

               // Get hospital details for notification
               const hospital = await Hospital.findById(placement.hospitalId);
               const hospitalUser = hospital ? await User.findById(hospital.userId) : null;

               // Send notification to student about new placement match
               await createNotification({
                    receiver: studentPlacementEnquiry.studentId,
                    title: notificationMessages.STUDENT_NEW_MATCH.title,
                    message: `A new placement has been matched for you at ${hospital?.hospitalName || 'a hospital'}. Check your dashboard for details.`,
                    type: notificationMessages.STUDENT_NEW_MATCH.type,
               });

               // Send notification to hospital about new student match
               if (hospitalUser) {
                    await createNotification({
                         receiver: hospitalUser._id.toString(),
                         title: notificationMessages.HOSPITAL_NEW_APPLICATION.title,
                         message: `A student has been matched with your placement. Review their profile in the dashboard.`,
                         type: notificationMessages.HOSPITAL_NEW_APPLICATION.type,
                    });
               }
          }
     }

     await StudentPlacementEnquiry.findByIdAndUpdate(enquiryId, { finalPaymentAmount: payload.finalPaymentAmount, stage: "awaiting response" }, { new: true });
     return null;
};

const adminOverview = async (year: number) => {
     const currentYear = new Date().getFullYear();
     let targetYear = year || currentYear;
     if (targetYear < 2000 || targetYear > currentYear) {
          targetYear = currentYear;
     }

     const totalApplications = await StudentPlacementEnquiry.countDocuments({ isDeleted: false });
     const hospitals = await Hospital.countDocuments({ isDeleted: false });

     const allPlacements = await Placement.find({ isDeleted: false });
     const totalEmptySeats = allPlacements.reduce((acc, placement) => acc + (placement.totalSeats - placement.filledSeats), 0);

     const allPayments = await Payment.find({ status: 'succeeded' });
     const totalRevenue = allPayments.reduce((acc, payment) => acc + payment.amount, 0);

     const start = new Date(`${targetYear}-01-01`);
     const end = new Date(`${targetYear}-12-31T23:59:59.999Z`);

     const months = [
          { month: 'Jan', totalRevenue: 0 },
          { month: 'Feb', totalRevenue: 0 },
          { month: 'Mar', totalRevenue: 0 },
          { month: 'Apr', totalRevenue: 0 },
          { month: 'May', totalRevenue: 0 },
          { month: 'Jun', totalRevenue: 0 },
          { month: 'Jul', totalRevenue: 0 },
          { month: 'Aug', totalRevenue: 0 },
          { month: 'Sep', totalRevenue: 0 },
          { month: 'Oct', totalRevenue: 0 },
          { month: 'Nov', totalRevenue: 0 },
          { month: 'Dec', totalRevenue: 0 },
     ];

     const revenue = await Payment.aggregate([
          {
               $match: {
                    status: 'succeeded',
                    createdAt: { $gte: start, $lte: end },
               },
          },
          {
               $group: {
                    _id: { $month: '$createdAt' },
                    totalRevenue: { $sum: '$amount' },
               },
          },
          { $sort: { _id: 1 } },
          {
               $project: {
                    _id: 0,
                    monthIndex: '$_id',
                    month: {
                         $arrayElemAt: [['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], '$_id'],
                    },
                    totalRevenue: 1,
               },
          },
     ]);

     const revenueBarChart = months.map((m, idx) => {
          const found = revenue.find((r) => r.monthIndex === idx + 1);
          return {
               month: m.month,
               totalRevenue: found ? found.totalRevenue : 0,
          };
     });

     const data = await Payment.aggregate([
          {
               $match: {
                    status: 'succeeded',
               },
          },
          {
               $group: {
                    _id: { $year: '$createdAt' },
                    totalRevenue: { $sum: '$amount' },
               },
          },
          { $sort: { _id: 1 } },
          {
               $setWindowFields: {
                    sortBy: { _id: 1 },
                    output: {
                         prevRevenue: {
                              $shift: {
                                   output: '$totalRevenue',
                                   by: -1,
                              },
                         },
                    },
               },
          },
          {
               $addFields: {
                    percentageChange: {
                         $cond: [
                              { $or: [{ $eq: ['$prevRevenue', null] }, { $eq: ['$prevRevenue', 0] }] },
                              0,
                              {
                                   $multiply: [
                                        {
                                             $divide: [{ $subtract: ['$totalRevenue', '$prevRevenue'] }, '$prevRevenue'],
                                        },
                                        100,
                                   ],
                              },
                         ],
                    },
               },
          },
          {
               $project: {
                    _id: 0,
                    year: '$_id',
                    totalRevenue: 1,
                    percentageChange: { $round: ['$percentageChange', 2] },
               },
          },
     ]);

     const revenueLineChart = data;

     const allEnquiries = await StudentPlacementEnquiry.aggregate([
          { $match: { isDeleted: false } },
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
                                   preferredSpecialty: 1,
                                   preferredCities: 1,
                                   languages: 1,
                                   profileImage: 1,
                              },
                         },
                    ],
                    as: 'studentProfile',
               },
          },
          {
               $unwind: {
                    path: '$studentProfile',
                    preserveNullAndEmptyArrays: true,
               },
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
                              },
                         },
                    ],
                    as: 'studentUser',
               },
          },
          {
               $unwind: {
                    path: '$studentUser',
                    preserveNullAndEmptyArrays: true,
               },
          },
          {
               $addFields: {
                    student: {
                         $mergeObjects: ['$studentProfile', { email: '$studentUser.email', role: '$studentUser.role' }],
                    },
               },
          },
          {
               $project: {
                    studentProfile: 0,
                    studentUser: 0,
               },
          },
     ]);

     return {
          totalApplications,
          hospitals,
          totalEmptySeats,
          totalRevenue,
          allApplications: allEnquiries,
          revenueBarChart,
          revenueLineChart,
          growthRate: revenueLineChart.length > 1 ? revenueLineChart[revenueLineChart.length - 1].percentageChange : 0,
     };
};

const getHospitals = async (): Promise<IHospital[]> => {
     const hospitals = await Hospital.find({ isDeleted: false }).populate('userId', 'email');
     return hospitals;
};

const getAllPlacements = async (): Promise<IPlacement[]> => {
     const placements = await Placement.find({ isDeleted: false }).populate('hospitalId', 'name location');
     return placements;
};

const getAllAvailablePlacements = async (): Promise<IPlacement[]> => {
     const startOfToday = new Date();
     startOfToday.setHours(0, 0, 0, 0);

     const placements = await Placement.aggregate([
          { $match: { isDeleted: false, status: 'available' } },
          {
               $addFields: {
                    deadlineDate: {
                         $dateFromString: {
                              dateString: '$deadline',
                              onError: null,
                              onNull: null,
                         },
                    },
               },
          },
          {
               $match: {
                    $expr: {
                         $and: [{ $gt: ['$totalSeats', '$filledSeats'] }, { $ne: ['$deadlineDate', null] }, { $lt: ['$deadlineDate', startOfToday] }],
                    },
               },
          },
          { $project: { deadlineDate: 0 } },
     ]);

     return placements as IPlacement[];
};
export const AdminService = {
     changeStudentPlacementEnquiryStatus,
     adminOverview,
     changeStudentPlacementEnquiryStage,
     matchPlacement,
};
