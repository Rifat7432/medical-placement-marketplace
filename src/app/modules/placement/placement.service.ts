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

const getPlacements = async (id: string): Promise<IPlacement[]> => {
     const placements = await Placement.find({ hospitalId: id ,isDeleted: false});
     return placements;
};

const getPlacementById = async (id: string): Promise<IPlacement | null> => {
     const placement = await Placement.findById(id);
     if (!placement || placement.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     return placement;
};

const updatePlacement = async (id: string, payload: Partial<IPlacement>): Promise<IPlacement | null> => {
     const placement = await Placement.findOneAndUpdate(
          { _id: id, isDeleted: false },
          payload,
          { new: true }
     );
     if (!placement || placement.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     return placement;
};

const deletePlacement = async (id: string): Promise<IPlacement | null> => {
     const placement = await Placement.findOneAndUpdate(
          { _id: id, isDeleted: false },
          { isDeleted: true },
          { new: true },
     );
     if (!placement || placement.isDeleted) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Placement not found');
     }
     return placement;
};

export const PlacementService = {
     createPlacementToDB,
     getPlacements,
     getPlacementById,
     updatePlacement,
     deletePlacement,
};
