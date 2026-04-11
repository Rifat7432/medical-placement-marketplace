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
     if (enquiry.firstPayment === 'pending') {
          amount = enquiry.firstPaymentAmount;
     } else if (enquiry.finalPayment === 'pending') {
          amount = enquiry.finalPaymentAmount;
     }
     if (!amount) {
          throw new AppError(StatusCodes.BAD_REQUEST, 'No pending payment found for this enquiry');
     }
     const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: 'gbp',

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
          amount: amount * 100,
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
