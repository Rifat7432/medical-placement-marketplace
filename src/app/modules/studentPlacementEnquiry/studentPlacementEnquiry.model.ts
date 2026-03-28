import { model, Schema } from 'mongoose';
import { IStudentPlacementEnquiry, StudentPlacementEnquiryModel } from './studentPlacementEnquiry.interface';

const studentPlacementEnquirySchema = new Schema<IStudentPlacementEnquiry, StudentPlacementEnquiryModel>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
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
  },
  { timestamps: true },
);

// Exist StudentPlacementEnquiry Check
studentPlacementEnquirySchema.statics.isExistStudentPlacementEnquiryById = async (id: string) => {
  return await StudentPlacementEnquiry.findById(id);
};

// Query Middleware
studentPlacementEnquirySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentPlacementEnquirySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentPlacementEnquirySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const StudentPlacementEnquiry = model<IStudentPlacementEnquiry, StudentPlacementEnquiryModel>('StudentPlacementEnquiry', studentPlacementEnquirySchema);