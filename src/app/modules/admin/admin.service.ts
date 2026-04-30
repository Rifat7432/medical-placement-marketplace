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
     const totalApplications = await StudentPlacementEnquiry.countDocuments({ isDeleted: false });

     const hospitals = await Hospital.countDocuments({ isDeleted: false });

     const allPlacements = await Placement.find({ isDeleted: false });
     const totalEmptySeats = allPlacements.reduce((acc, placement) => acc + (placement.totalSeats - placement.filledSeats), 0);

     const allPayments = await Payment.find({ status: 'succeeded' });
     const totalRevenue = allPayments.reduce((acc, payment) => acc + payment.amount, 0);

     const start = new Date(`${year}-01-01`);
     const end = new Date(`${year}-12-31T23:59:59.999Z`);

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
          { $sort: { _id: 1 } }, // ✅ sort BEFORE project
          {
               $project: {
                    _id: 0,
                    month: {
                         $arrayElemAt: [['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], '$_id'],
                    },
                    totalRevenue: 1,
               },
          },
     ]);

     const data = await Payment.aggregate([
          {
               $match: {
                    status: 'succeeded',
               },
          },

          // 📊 group by year
          {
               $group: {
                    _id: { $year: '$createdAt' },
                    totalRevenue: { $sum: '$amount' },
               },
          },

          // 🔢 sort by year
          { $sort: { _id: 1 } },

          // 🧠 get previous year's revenue
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

          // 📈 calculate % change (increase OR decrease)
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

          // 🏷️ final shape
          {
               $project: {
                    _id: 0,
                    year: '$_id',
                    totalRevenue: 1,
                    percentageChange: { $round: ['$percentageChange', 2] },
               },
          },
     ]);

     const rejectedEnquiries = await StudentPlacementEnquiry.countDocuments({ isDeleted: false, adminStatus: 'rejected' });
     const allEnquiries = await StudentPlacementEnquiry.find({ isDeleted: false }).populate('student', 'name email').populate('placement', 'title');

     return {
          totalApplications,
          hospitals,
          totalEmptySeats,
          totalRevenue,

          allApplications: allEnquiries,
          revenueBarChart: revenue,
          revenueLineChart: data,
     };
};

export const AdminService = {
     changeStudentPlacementEnquiryStatus,
     adminOverview,
};
