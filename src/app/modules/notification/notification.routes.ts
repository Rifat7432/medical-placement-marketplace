import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';
import auth from '../../middleware/auth';

const router = express.Router();

// ✅ User notifications
router.get(
  '/',
  auth(),
  NotificationController.getUserNotifications
);

router.patch(
  '/',
  auth(),
  NotificationController.markUserNotificationsAsRead
);


export const NotificationRoutes = router;
