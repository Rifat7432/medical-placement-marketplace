import { StatusCodes } from 'http-status-codes';
import { IPlacement } from './placement.interface';
import { Placement } from './placement.model';
import AppError from '../../../errors/AppError';
import { User } from '../user/user.model';
import { USER_ROLES } from '../../../enums/user';

const createPlacementToDB = async (payload: Partial<IPlacement>, hospitalId: string): Promise<IPlacement> => {
     const isUserExist = await User.findOne({ _id: hospitalId });

     if (!isUserExist) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Hospital user not found');
     }

     const placement = await Placement.create({ ...payload, ...(isUserExist.role === USER_ROLES.ADMIN ? {} : { hospitalId }) });
     if (!placement) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create placement');
     }
     return placement;
};

const getPlacements = async () => {
     const placements = await Placement.find({ isDeleted: false }).populate('hospitalId', 'name location');
     return placements as IPlacement[];
};
const getPlacementsOfHospital = async (id: string): Promise<IPlacement[]> => {
     const placements = await Placement.find({ hospitalId: id, isDeleted: false });
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

     return placements;
};



const getPlacementById = async (id: string): Promise<IPlacement | null> => {
     const placement = await Placement.findById(id).populate('hospitalId', 'name location');
     if (!placement || placement.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     return placement;
};

const updatePlacement = async (id: string, payload: Partial<IPlacement>): Promise<IPlacement | null> => {
     const placement = await Placement.findOneAndUpdate({ _id: id, isDeleted: false }, payload, { new: true });
     if (!placement || placement.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     return placement;
};

const deletePlacement = async (id: string): Promise<IPlacement | null> => {
     const isPlacement = await Placement.findOne({ _id: id, isDeleted: false });

     if (!isPlacement || isPlacement.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     const placement = await Placement.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
     return placement;
};

export const PlacementService = {
     createPlacementToDB,
     getPlacements,
     getPlacementById,
     updatePlacement,
     deletePlacement,
     getPlacementsOfHospital,
     getAllAvailablePlacements,
};
