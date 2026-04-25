import { model, Schema } from 'mongoose';
import { IHospital, HospitalModel } from './hospital.interface';

const hospitalSchema = new Schema<IHospital, HospitalModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hospitalName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String },
    description: { type: String },
    logo: { type: String },
    totalSeats: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Exist Hospital Check
hospitalSchema.statics.isExistHospitalById = async (id: string) => {
  return await Hospital.findById(id);
};

hospitalSchema.statics.isExistHospitalByUserId = async (userId: string) => {
  return await Hospital.findOne({ userId });
};

// Query Middleware
hospitalSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

hospitalSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

hospitalSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Hospital = model<IHospital, HospitalModel>('Hospital', hospitalSchema);