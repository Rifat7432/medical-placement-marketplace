import { StatusCodes } from 'http-status-codes';
import { IHospital } from './hospital.interface';
import { Hospital } from './hospital.model';
import AppError from '../../../errors/AppError';
import { Placement } from '../placement/placement.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { NotificationService } from '../notification/notification.service';
import { Notification } from '../notification/notification.model';

const getHospitals = async (): Promise<IHospital[]> => {
     const hospitals = await Hospital.find({ isDeleted: false }).populate('userId', 'email');
     return hospitals;
};
const getHospitalProfile = async (id: string): Promise<IHospital | null> => {
     const hospital = await Hospital.findOne({ userId: id }).populate('userId', 'email');
     return hospital;
};

const getHospitalById = async (id: string): Promise<IHospital | null> => {
     const hospital = await Hospital.findById(id).populate('userId', 'email');
     return hospital;
};

const updateHospital = async (id: string, payload: Partial<IHospital>): Promise<IHospital | null> => {
     const existingHospital = await User.findById(id);
     if (!existingHospital) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Hospital not found');
     }
     const hospital = await Hospital.findOneAndUpdate({ userId: id }, payload, { new: true });
     return hospital;
};

const deleteHospital = async (id: string): Promise<IHospital | null> => {
     const hospital = await Hospital.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
     return hospital;
};
const hospitalOverview = async (id: string) => {
     const activePlacements = await Placement.find({
          hospitalId: new mongoose.Types.ObjectId(id),
          status: 'available',
          isDeleted: { $ne: true },
     }).countDocuments();
     const applicationCounts = await Placement.aggregate([
          {
               $match: {
                    isDeleted: { $ne: true },
                    hospitalId: new mongoose.Types.ObjectId(id),
               },
          },
          {
               $lookup: {
                    from: 'studentplacementenquiries',
                    let: { placementId: '$_id' },
                    pipeline: [
                         {
                              $match: {
                                   $expr: {
                                        $eq: ['$chosenPlacementId', '$$placementId'],
                                   },
                                   isDeleted: { $ne: true },
                              },
                         },
                    ],
                    as: 'applications',
               },
          },
          {
               $project: {
                    totalApplications: {
                         $size: '$applications',
                    },

                    approvedApplications: {
                         $size: {
                              $filter: {
                                   input: '$applications',
                                   as: 'application',
                                   cond: {
                                        $eq: ['$$application.hospitalStatus', 'approved'],
                                   },
                              },
                         },
                    },

                    pendingApplications: {
                         $size: {
                              $filter: {
                                   input: '$applications',
                                   as: 'application',
                                   cond: {
                                        $eq: ['$$application.hospitalStatus', 'pending'],
                                   },
                              },
                         },
                    },
               },
          },
          {
               $group: {
                    _id: null,

                    totalApplications: {
                         $sum: '$totalApplications',
                    },

                    approvedApplications: {
                         $sum: '$approvedApplications',
                    },

                    pendingApplications: {
                         $sum: '$pendingApplications',
                    },
               },
          },
     ]);

     const recentPlacements = await Placement.find({
          isDeleted: { $ne: true },
     })
          .sort({ createdAt: -1 })
          .limit(3);
 const result = await Notification.find({ receiver: id }).sort({ createdAt: -1 });
     return {
          activePlacements,
          totalApplications: applicationCounts.length > 0 ? applicationCounts[0].totalApplications : 0,
          approvedApplications: applicationCounts.length > 0 ? applicationCounts[0].approvedApplications : 0,
          pendingApplications: applicationCounts.length > 0 ? applicationCounts[0].pendingApplications : 0,
          recentPlacements,
          notifications: result,
     };
};
export const HospitalService = {
     hospitalOverview,
     getHospitals,
     getHospitalById,
     updateHospital,
     deleteHospital,

     getHospitalProfile,
};
