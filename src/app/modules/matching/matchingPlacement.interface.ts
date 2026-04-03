import mongoose, { Document, Model } from 'mongoose';

export interface IMatchingPlacement extends Document {
     studentId: mongoose.Types.ObjectId;
     placementId: mongoose.Types.ObjectId;
     enquiryId: mongoose.Types.ObjectId;
     isDeleted: boolean;
     createdAt: Date;
     updatedAt: Date;
}

export type MatchingPlacementModel = {
     isExistMatchingPlacementById(id: string): any;
} & Model<IMatchingPlacement>;  