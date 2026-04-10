import { Payment } from './payment.model';
import stripe from '../../../config/stripe';
import { User } from '../user/user.model';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../errors/AppError';
import config from '../../../config';

const createPaymentIntent = async (userId: string, enquiryId: string, amount: number) => {
     const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: 'usd',

          metadata: {
               userId,
               enquiryId,
          },
     });

     // store اولیه (pending)
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
