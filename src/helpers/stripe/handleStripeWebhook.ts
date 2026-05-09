import { Request, Response } from 'express';

import { Payment } from '../../app/modules/payment/payment.model';
import stripe from '../../config/stripe';
import Stripe from 'stripe';
import config from '../../config';
import { StudentPlacementEnquiry } from '../../app/modules/studentPlacementEnquiry/studentPlacementEnquiry.model';

export const webhook = async (req: Request, res: Response): Promise<void> => {
     const sig = req.headers['stripe-signature'] as string;

     let event: Stripe.Event;

     try {
          event = stripe.webhooks.constructEvent(req.body, sig, config?.stripe?.stripe_webhook_secret as string);
     } catch (err: any) {
          console.error('Webhook signature verification failed:', err.message);

          res.status(400).send(`Webhook Error: ${err.message}`);
          return;
     }

     const data = event.data.object as Stripe.PaymentIntent;

     // Payment success
     if (event.type === 'payment_intent.succeeded') {
          const paymentInfo = await Payment.findOneAndUpdate(
               { paymentIntentId: data.id },
               {
                    status: 'succeeded',
                    stripeCustomerId: data.customer as string,
                    trxId: data.latest_charge as string,
               },
          );

          if (paymentInfo) {
               const enquiry = await StudentPlacementEnquiry.findById(paymentInfo.enquiryId);

               if (enquiry?.firstPayment === 'pending' && enquiry.finalPayment === 'pending') {
                    await StudentPlacementEnquiry.findByIdAndUpdate(paymentInfo.enquiryId, {
                         firstPayment: 'paid',
                         firstPaymentId: paymentInfo._id,
                         stage: 'matching required',
                         studentStatus: 'matching',
                    });
               } else if (enquiry?.finalPayment === 'pending' && enquiry.firstPayment === 'paid') {
                    await StudentPlacementEnquiry.findByIdAndUpdate(paymentInfo.enquiryId, {
                         finalPayment: 'paid',
                         finalPaymentId: paymentInfo._id,
                         stage: 'completed',
                    });
               }
          }
     }

     // Payment failed
     if (event.type === 'payment_intent.payment_failed') {
          await Payment.findOneAndUpdate(
               { paymentIntentId: data.id },
               {
                    status: 'failed',
               },
          );
     }

     res.json({ received: true });
};
