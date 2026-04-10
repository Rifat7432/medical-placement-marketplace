import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { SubscriptionController } from './payment.controller';
import auth from '../../middleware/auth';
const router = express.Router();

router.get('/success', SubscriptionController.orderSuccess);

router.post('/create-payment/:id', auth(USER_ROLES.STUDENT), SubscriptionController.createCheckoutSession);

export const SubscriptionRoutes = router;
