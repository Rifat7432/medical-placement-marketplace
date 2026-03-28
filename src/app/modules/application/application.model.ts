import { model, Schema } from 'mongoose';
import { IApplication, ApplicationModel } from './application.interface';

const applicationSchema = new Schema<IApplication, ApplicationModel>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    placementId: { type: Schema.Types.ObjectId, ref: 'Placement' },
    enquiryId: { type: Schema.Types.ObjectId, ref: 'StudentPlacementEnquiry' },
    program: { type: String, required: true },
    status: { type: String, default: 'pending' },
    paymentStatus: [{ type: String }],
  },
  { timestamps: true },
);

// Exist Application Check
applicationSchema.statics.isExistApplicationById = async (id: string) => {
  return await Application.findById(id);
};

// Query Middleware
applicationSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

applicationSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

applicationSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Application = model<IApplication, ApplicationModel>('Application', applicationSchema);