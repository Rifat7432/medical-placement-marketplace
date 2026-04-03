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

     stage: 'awaiting for payment' | 'matching required' | 'awaiting response' | 'completed';

     placementId?: [mongoose.Types.ObjectId];
     chosenPlacementId?: mongoose.Types.ObjectId;

     hospitalStatus: 'pending' | 'approved' | 'rejected';
     studentStatus: 'pending' | 'matching' | 'approved' | 'rejected';
     adminStatus: 'pending' | 'approved' | 'rejected';

     firstPayment: 'pending' | 'paid';
     finalPayment: 'pending' | 'paid';

     isVisibleToHospitals: boolean;
     isDeleted: boolean;

     createdAt: Date;
     updatedAt: Date;
}

export type StudentPlacementEnquiryModel = {
     isExistStudentPlacementEnquiryById(id: string): any;
} & Model<IStudentPlacementEnquiry>;
