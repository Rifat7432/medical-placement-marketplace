import catchAsync from '../../../shared/catchAsync';
import { SubscriptionService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create checkout session
const createCheckoutSession = catchAsync(async (req, res) => {
     const { id }: any = req.user;
     const enquiryId = req.params.id;
     const result = await SubscriptionService.createPaymentIntent(id, enquiryId, req.body.amount);

     sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: 'Payment intent created successfully',
          data: {
               clientSecret: result.clientSecret,
          },
     });
});

const orderSuccess = catchAsync(async (req, res) => {
     const sessionId = req.query.session_id as string;
     const session = await SubscriptionService.successMessage(sessionId);
     res.render('success', { session });
});

export const SubscriptionController = {
     createCheckoutSession,
     orderSuccess,
};
