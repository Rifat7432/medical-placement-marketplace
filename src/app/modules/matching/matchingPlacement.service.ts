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

const getMatchingPlacements = async (): Promise<IMatchingPlacement[]> => {
     const matchingPlacements = await MatchingPlacement.find();
     return matchingPlacements;
};

const getMatchingPlacementsByStudent = async (studentId: string): Promise<IMatchingPlacement[]> => {
     const matchingPlacements = await MatchingPlacement.find({ studentId });
     return matchingPlacements;
};

const getMatchingPlacementsByPlacement = async (placementId: string): Promise<IMatchingPlacement[]> => {
     const matchingPlacements = await MatchingPlacement.find({ placementId });
     return matchingPlacements;
};

const getMatchingPlacementById = async (id: string): Promise<IMatchingPlacement | null> => {
     const matchingPlacement = await MatchingPlacement.findById(id);
     return matchingPlacement;
};

const getMatchingPlacementByEnquiry = async (enquiryId: string): Promise<IMatchingPlacement | null> => {
     const matchingPlacement = await MatchingPlacement.findOne({ enquiryId });
     return matchingPlacement;
};

const updateMatchingPlacement = async (id: string, payload: Partial<IMatchingPlacement>): Promise<IMatchingPlacement | null> => {
     const matchingPlacement = await MatchingPlacement.findByIdAndUpdate(id, payload, { new: true });
     return matchingPlacement;
};

const deleteMatchingPlacement = async (id: string): Promise<IMatchingPlacement | null> => {
     const matchingPlacement = await MatchingPlacement.findByIdAndDelete(id);
     return matchingPlacement;
};

export const MatchingPlacementService = {
     createMatchingPlacementToDB,
     getMatchingPlacements,
     getMatchingPlacementsByStudent,
     getMatchingPlacementsByPlacement,
     getMatchingPlacementById,
     getMatchingPlacementByEnquiry,
     updateMatchingPlacement,
     deleteMatchingPlacement,
};