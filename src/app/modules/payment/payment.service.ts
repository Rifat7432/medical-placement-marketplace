import { Payment } from './payment.model';
import stripe from '../../../config/stripe';
import { User } from '../user/user.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import config from '../../../config';
import { StudentPlacementEnquiry } from '../studentPlacementEnquiry/studentPlacementEnquiry.model';

const createPaymentIntent = async (userId: string, enquiryId: string) => {
     const enquiry = await StudentPlacementEnquiry.findById(enquiryId);
     if (!enquiry) {
          throw new AppError(StatusCodes.NOT_FOUND, 'Enquiry not found');
     }

     let amount = null;
     if (enquiry.firstPayment === 'pending' && enquiry.finalPayment === 'pending') {
          amount = enquiry.firstPaymentAmount;
     } else if (enquiry.finalPayment === 'pending' && enquiry.firstPayment === 'paid') {
          amount = enquiry.finalPaymentAmount;
     }
     if (amount === null) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'No pending payment found for this enquiry');
     }
     const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: 'gbp',

          automatic_payment_methods: {
               enabled: true,
          },

          // 👇 THIS enables OTP/3DS when needed
          payment_method_options: {
               card: {
                    request_three_d_secure: 'automatic', // or "any"
               },
          },

          metadata: {
               userId,
               enquiryId,
          },
     });

     // store (pending)
     await Payment.create({
          userId,
          enquiryId,
          paymentIntentId: paymentIntent.id,
          amount: Math.round(amount),
     });

     return {
          clientSecret: paymentIntent.client_secret,
     };
};
const successMessage = async (id: string) => {
     const session = await stripe.checkout.sessions.retrieve(id);
     return session;
};
export const SubscriptionService = {
     successMessage,
     createPaymentIntent,
};