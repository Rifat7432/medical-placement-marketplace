import { Model, Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

export type IPayment = {
     userId: Types.ObjectId;

     enquiryId:  Types.ObjectId;

     paymentIntentId: string;

     trxId?: string;

     stripeCustomerId?: string;

     amount: number; // in cents

     currency: string; // default: 'usd'

     status: PaymentStatus;

     isDeleted: boolean;

     createdAt?: Date;
     updatedAt?: Date;
};
