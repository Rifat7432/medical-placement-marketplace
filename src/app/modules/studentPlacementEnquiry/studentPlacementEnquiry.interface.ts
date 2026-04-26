import mongoose, { Document, Model } from 'mongoose';

export interface IStudentPlacementEnquiry extends Document {
     studentId: mongoose.Types.ObjectId;

     email: string;
     firstName: string;
     lastName: string;
     phoneNumber: string;
     universityOrMedicalSchool: string;
     yearOfStudy: number;
     preferredStartDate: string;
     duration: string;
     preferredSpecialty: string;
     preferredCities: string;
     language: string;
     documents: string[];
     additionalInformation?: string;

     stage: 'awaiting for payment' | 'matching required' | 'awaiting response' | 'completed'| 'rejected';

     placementId?: [mongoose.Types.ObjectId];
     chosenPlacementId?: mongoose.Types.ObjectId;

     hospitalStatus: 'pending' | 'approved' | 'rejected';
     studentStatus: 'pending' | 'matching' | 'approved' | 'rejected';
     adminStatus: 'pending' | 'approved' | 'rejected';

     firstPayment: 'pending' | 'paid';
     firstPaymentId?: mongoose.Types.ObjectId;
     firstPaymentAmount: number;
     finalPayment: 'pending' | 'paid';
     finalPaymentId?: mongoose.Types.ObjectId;
     finalPaymentAmount: number;
     isVisibleToHospitals: boolean;
     isDeleted: boolean;

     createdAt: Date;
     updatedAt: Date;
}

export type StudentPlacementEnquiryModel = {
     isExistStudentPlacementEnquiryById(id: string): any;
} & Model<IStudentPlacementEnquiry>;
