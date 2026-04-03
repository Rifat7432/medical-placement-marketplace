import { model, Schema } from 'mongoose';
import { IMatchingPlacement, MatchingPlacementModel } from './matchingPlacement.interface';

const matchingPlacementSchema = new Schema<IMatchingPlacement, MatchingPlacementModel>(
     {
          studentId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
               index: true,
          },
          placementId: {
               type: Schema.Types.ObjectId,
               ref: 'Placement',
               required: true,
          },
          enquiryId: {
               type: Schema.Types.ObjectId,
               ref: 'StudentPlacementEnquiry',
               required: true,
          },
          isDeleted: {
               type: Boolean,
               default: false,
          },
     },
     {
          timestamps: true,
     }
);


// Exist MatchingPlacement Check
matchingPlacementSchema.statics.isExistMatchingPlacementById = async (id: string) => {
     return await MatchingPlacement.findById(id);
};

// Query Middleware
matchingPlacementSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

matchingPlacementSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

matchingPlacementSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const MatchingPlacement = model<IMatchingPlacement, MatchingPlacementModel>('MatchingPlacement', matchingPlacementSchema);