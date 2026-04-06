import { model, Schema } from 'mongoose';
import { IStudent, StudentModel } from './student.interface';

const studentSchema = new Schema<IStudent, StudentModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String },
    phoneNumber: { type: String },
    university: { type: String },
    yearOfStudy: { type: Number},
    preferredSpecialty: { type: String },
    preferredCities: { type: String },
    languages: { type: String },
    profileImage: { type: String },
  },
  { timestamps: true },
);

// Exist Student Check
studentSchema.statics.isExistStudentById = async (id: string) => {
  return await Student.findById(id);
};

studentSchema.statics.isExistStudentByUserId = async (userId: string) => {
  return await Student.findOne({ userId });
};

// Query Middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Student = model<IStudent, StudentModel>('Student', studentSchema);