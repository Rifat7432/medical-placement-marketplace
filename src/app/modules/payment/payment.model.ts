import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
     {
          userId: {
               type: Schema.Types.ObjectId,
               ref: 'User',
               required: true,
          },

          enquiryId: {
               type: Schema.Types.ObjectId, // your enquiry id
               ref: 'StudentPlacementEnquiry',
               required: true,
          },

          // 🔥 Stripe داده
          paymentIntentId: {
               type: String,
               required: true,
               unique: true,
          },

          trxId: {
               type: String, // transaction id (from Stripe)
          },

          stripeCustomerId: {
               type: String,
          },

          amount: {
               type: Number, // cents
               required: true,
          },

          currency: {
               type: String,
               default: 'usd',
          },

          status: {
               type: String,
               enum: ['pending', 'succeeded', 'failed'],
               default: 'pending',
          },
     },
     { timestamps: true },
);

export const Payment = model('Payment', paymentSchema);
