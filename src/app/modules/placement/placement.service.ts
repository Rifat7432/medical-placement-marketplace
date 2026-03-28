import { StatusCodes } from 'http-status-codes';
import { IPlacement } from './placement.interface';
import { Placement } from './placement.model';
import AppError from '../../../errors/AppError';

const createPlacementToDB = async (payload: Partial<IPlacement>): Promise<IPlacement> => {
  const placement = await Placement.create(payload);
  if (!placement) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create placement');
  }
  return placement;
};

const getPlacements = async (): Promise<IPlacement[]> => {
  const placements = await Placement.find();
  return placements;
};

const getPlacementById = async (id: string): Promise<IPlacement | null> => {
  const placement = await Placement.findById(id);
  return placement;
};

const updatePlacement = async (id: string, payload: Partial<IPlacement>): Promise<IPlacement | null> => {
  const placement = await Placement.findByIdAndUpdate(id, payload, { new: true });
  return placement;
};

const deletePlacement = async (id: string): Promise<IPlacement | null> => {
  const placement = await Placement.findByIdAndDelete(id);
  return placement;
};

export const PlacementService = {
  createPlacementToDB,
  getPlacements,
  getPlacementById,
  updatePlacement,
  deletePlacement,
};