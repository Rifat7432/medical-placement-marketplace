import { model, Schema } from 'mongoose';
import { IPlacement, PlacementModel } from './placement.interface';

const placementSchema = new Schema<IPlacement, PlacementModel>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },
    department: { type: String, required: true },
    location: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    filledSeats: { type: Number, default: 0 },
    durationWeeks: { type: String, required: true },
    deadline: { type: String, required: true },
    startDate: { type: String, required: true },
    requirements: { type: String },
    description: { type: String },
  },
  { timestamps: true },
);

// Exist Placement Check
placementSchema.statics.isExistPlacementById = async (id: string) => {
  return await Placement.findById(id);
};

// Query Middleware
placementSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

placementSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

placementSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Placement = model<IPlacement, PlacementModel>('Placement', placementSchema);