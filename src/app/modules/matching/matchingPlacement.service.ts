import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { IMatchingPlacement } from './matchingPlacement.interface';
import { MatchingPlacement } from './matchingPlacement.model';
import AppError from '../../../errors/AppError';

const createMatchingPlacementToDB = async (payload: IMatchingPlacement): Promise<IMatchingPlacement> => {
     const matchingPlacement = await MatchingPlacement.create(payload);
     if (!matchingPlacement) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create matching placement');
     }
     return matchingPlacement;
};
export const MatchingPlacementService = {
     createMatchingPlacementToDB,
};
