import { model, Schema } from 'mongoose';
import { IPlacementsEnquiry, PlacementsEnquiryModel } from './placementsEnquiry.interface';

const placementsEnquirySchema = new Schema<IPlacementsEnquiry, PlacementsEnquiryModel>(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    universityOrMedicalSchool: { type: String, required: true },
    yearOfStudy: { type: Number, required: true },
    preferredStartDate: { type: String, required: true },
    duration: { type: String, required: true },
    preferredSpecialty: { type: String, required: true },
    preferredCities: { type: String, required: true },
    language: { type: String, required: true },
    documents: [{ type: String }],
    additionalInformation: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Exist PlacementsEnquiry Check
placementsEnquirySchema.statics.isExistPlacementsEnquiryById = async (id: string) => {
  return await PlacementsEnquiry.findById(id);
};

// Query Middleware
placementsEnquirySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

placementsEnquirySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

placementsEnquirySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const PlacementsEnquiry = model<IPlacementsEnquiry, PlacementsEnquiryModel>('PlacementsEnquiry', placementsEnquirySchema);