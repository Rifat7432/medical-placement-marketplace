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
               default: 'gbp',
          },

          status: {
               type: String,
               enum: ['pending', 'succeeded', 'failed'],
               default: 'pending',
          },

          isDeleted: {
               type: Boolean,
               default: false,
          },
     },
     { timestamps: true },
);

// Query Middleware
paymentSchema.pre('find', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

paymentSchema.pre('findOne', function (next) {
     this.find({ isDeleted: { $ne: true } });
     next();
});

paymentSchema.pre('aggregate', function (next) {
     this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
     next();
});

export const Payment = model('Payment', paymentSchema);
