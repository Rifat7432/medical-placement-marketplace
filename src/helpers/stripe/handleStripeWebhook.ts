import { Request, Response } from 'express';

import { Payment } from '../../app/modules/payment/payment.model';
import stripe from '../../config/stripe';
import Stripe from 'stripe';
import config from '../../config';
import { StudentPlacementEnquiry } from '../../app/modules/studentPlacementEnquiry/studentPlacementEnquiry.model';
import { createNotification, notificationMessages } from '../../helpers/notificationHelper';
import { User } from '../../app/modules/user/user.model';

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
               const student = await User.findById(paymentInfo.userId);
               const admin = await User.findOne({ role: 'admin' });

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

               // Send payment success notification to student
               if (student) {
                    await createNotification({
                         receiver: student._id.toString(),
                         title: notificationMessages.STUDENT_PAYMENT_SUCCESS.title,
                         message: `Payment of £${(paymentInfo.amount / 100).toFixed(2)} has been processed successfully.`,
                         type: notificationMessages.STUDENT_PAYMENT_SUCCESS.type,
                    });
               }

               // Send payment notification to admin
               if (admin) {
                    await createNotification({
                         receiver: admin._id.toString(),
                         title: notificationMessages.ADMIN_PAYMENT_RECEIVED.title,
                         message: `Payment of £${(paymentInfo.amount / 100).toFixed(2)} received from student ${student?.email || 'Unknown'}.`,
                         type: notificationMessages.ADMIN_PAYMENT_RECEIVED.type,
                    });
               }
          }
     }

     // Payment failed
     if (event.type === 'payment_intent.payment_failed') {
          const paymentInfo = await Payment.findOneAndUpdate(
               { paymentIntentId: data.id },
               {
                    status: 'failed',
               },
          );

          if (paymentInfo) {
               const student = await User.findById(paymentInfo.userId);
               const admin = await User.findOne({ role: 'admin' });

               // Send payment failed notification to student
               if (student) {
                    await createNotification({
                         receiver: student._id.toString(),
                         title: notificationMessages.STUDENT_PAYMENT_FAILED.title,
                         message: notificationMessages.STUDENT_PAYMENT_FAILED.message,
                         type: notificationMessages.STUDENT_PAYMENT_FAILED.type,
                    });
               }

               // Send payment failed notification to admin
               if (admin) {
                    await createNotification({
                         receiver: admin._id.toString(),
                         title: notificationMessages.ADMIN_PAYMENT_FAILED.title,
                         message: `Payment of £${(paymentInfo.amount / 100).toFixed(2)} from student ${student?.email || 'Unknown'} has failed.`,
                         type: notificationMessages.ADMIN_PAYMENT_FAILED.type,
                    });
               }
          }
     }

     res.json({ received: true });
};
