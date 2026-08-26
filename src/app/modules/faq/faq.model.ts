import { model, Schema } from 'mongoose';
import { IFaq, FaqModel } from './faq.interface';

const faqSchema = new Schema<IFaq, FaqModel>(
  {
    category: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Exist FAQ Check
faqSchema.statics.isExistFaqById = async (id: string) => {
  return await Faq.findById(id);
};

// Query Middleware
faqSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

faqSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

faqSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Faq = model<IFaq, FaqModel>('Faq', faqSchema);
