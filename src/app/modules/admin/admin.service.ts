import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import { StudentPlacementEnquiry } from '../studentPlacementEnquiry/studentPlacementEnquiry.model';
import { Notification } from '../notification/notification.model';
import { Hospital } from '../hospital/hospital.model';
import { Placement } from '../placement/placement.model';
import { Payment } from '../payment/payment.model';

const changeStudentPlacementEnquiryStatus = async (id: string, payload: Partial<{ status: 'pending' | 'approved' | 'rejected' }>) => {
     const studentPlacementEnquiry = await StudentPlacementEnquiry.findById(id);
     if (!studentPlacementEnquiry || studentPlacementEnquiry.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Student placement enquiry not found');
     }

     if (payload.status === 'rejected') {
          const updatedEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { adminStatus: payload.status, stage: 'rejected', studentStatus: 'rejected' }, { new: true });
          return updatedEnquiry;
     }
     if (payload.status === 'approved') {
          const updatedEnquiry = await StudentPlacementEnquiry.findByIdAndUpdate(id, { adminStatus: payload.status, stage: 'awaiting for payment', studentStatus: 'approved' }, { new: true });
          return updatedEnquiry;
     }
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

export const AdminService = {
     changeStudentPlacementEnquiryStatus,
     adminOverview,
};
