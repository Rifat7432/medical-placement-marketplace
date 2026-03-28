import { model, Schema } from 'mongoose';
import { IEnquiry, EnquiryModel } from './enquiry.interface';

const enquirySchema = new Schema<IEnquiry, EnquiryModel>(
  {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

// Exist Enquiry Check
enquirySchema.statics.isExistEnquiryById = async (id: string) => {
  return await Enquiry.findById(id);
};

// Query Middleware
enquirySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

enquirySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

enquirySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Enquiry = model<IEnquiry, EnquiryModel>('Enquiry', enquirySchema);