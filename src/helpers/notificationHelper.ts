import { Notification } from '../app/modules/notification/notification.model';
import { Types } from 'mongoose';
import { logger } from '../shared/logger';

type NotificationType = 'ADMIN' | 'SYSTEM' | 'PAYMENT' | 'ALERT' | 'APPOINTMENT' | 'CANCELLED';

interface ICreateNotification {
  receiver: Types.ObjectId | string;
  title: string;
  message: string;
  type: NotificationType;
}

/**
 * Create and send a notification to a user
 * @param receiver User ID (ObjectId or string)
 * @param title Notification title
 * @param message Notification message
 * @param type Notification type
 */
export const createNotification = async ({
  receiver,
  title,
  message,
  type,
}: ICreateNotification): Promise<void> => {
  try {
    await Notification.create({
      receiver: new Types.ObjectId(receiver),
      title,
      message,
      type,
      read: false,
    });
    logger.info(`Notification created for user ${receiver}: ${title}`);
  } catch (error) {
    logger.error(`Failed to create notification for user ${receiver}:`, error);
  }
};

/**
 * Create notifications for multiple users
 * @param receivers Array of user IDs
 * @param title Notification title
 * @param message Notification message
 * @param type Notification type
 */
export const createBulkNotifications = async (
  receivers: (Types.ObjectId | string)[],
  title: string,
  message: string,
  type: NotificationType
): Promise<void> => {
  try {
    const notifications = receivers.map((receiver) => ({
      receiver: new Types.ObjectId(receiver),
      title,
      message,
      type,
      read: false,
    }));

    await Notification.insertMany(notifications);
    logger.info(`Bulk notifications created for ${receivers.length} users: ${title}`);
  } catch (error) {
    logger.error(`Failed to create bulk notifications:`, error);
  }
};

// Predefined notification messages
export const notificationMessages = {
  // Student Notifications
  STUDENT_SIGNUP: {
    title: 'Welcome to Medical Placement Marketplace',
    message: 'Your account has been successfully created. Start exploring placement opportunities!',
    type: 'SYSTEM' as NotificationType,
  },
  STUDENT_ENQUIRY_CREATED: {
    title: 'Placement Enquiry Submitted',
    message: 'Your placement enquiry has been submitted successfully. Admin will review it shortly.',
    type: 'ALERT' as NotificationType,
  },
  STUDENT_ENQUIRY_APPROVED: {
    title: 'Enquiry Approved',
    message: 'Your placement enquiry has been approved by admin. Proceed to payment.',
    type: 'ALERT' as NotificationType,
  },
  STUDENT_ENQUIRY_REJECTED: {
    title: 'Enquiry Rejected',
    message: 'Your placement enquiry has been rejected. Please contact admin for details.',
    type: 'ALERT' as NotificationType,
  },
  STUDENT_MATCHING_STARTED: {
    title: 'Matching Started',
    message: 'Your placement matching process has started. You will receive updates soon.',
    type: 'ALERT' as NotificationType,
  },
  STUDENT_NEW_MATCH: {
    title: 'New Placement Match',
    message: 'A new placement has been matched for you. Check your dashboard for details.',
    type: 'APPOINTMENT' as NotificationType,
  },
  STUDENT_PAYMENT_SUCCESS: {
    title: 'Payment Successful',
    message: 'Your payment has been processed successfully.',
    type: 'PAYMENT' as NotificationType,
  },
  STUDENT_PAYMENT_FAILED: {
    title: 'Payment Failed',
    message: 'Your payment could not be processed. Please try again.',
    type: 'ALERT' as NotificationType,
  },
  STUDENT_HOSPITAL_APPROVED: {
    title: 'Application Approved',
    message: 'The hospital has approved your application. Congratulations!',
    type: 'APPOINTMENT' as NotificationType,
  },
  STUDENT_HOSPITAL_REJECTED: {
    title: 'Application Status',
    message: 'The hospital has reviewed your application. Check your dashboard for details.',
    type: 'ALERT' as NotificationType,
  },
  STUDENT_MESSAGE_RECEIVED: {
    title: 'New Message',
    message: 'You have received a new message from a hospital.',
    type: 'ALERT' as NotificationType,
  },

  // Hospital Notifications
  HOSPITAL_SIGNUP: {
    title: 'Welcome to Medical Placement Marketplace',
    message: 'Your hospital account has been created successfully. Start posting placements!',
    type: 'SYSTEM' as NotificationType,
  },
  HOSPITAL_PLACEMENT_CREATED: {
    title: 'Placement Posted',
    message: 'Your placement has been successfully posted.',
    type: 'ALERT' as NotificationType,
  },
  HOSPITAL_PLACEMENT_DELETED: {
    title: 'Placement Removed',
    message: 'Your placement has been removed from the marketplace.',
    type: 'ALERT' as NotificationType,
  },
  HOSPITAL_NEW_APPLICATION: {
    title: 'New Student Application',
    message: 'A student has applied for one of your placements. Review their application.',
    type: 'APPOINTMENT' as NotificationType,
  },
  HOSPITAL_APPLICATION_APPROVED: {
    title: 'Application Status',
    message: 'You have approved a student application.',
    type: 'ALERT' as NotificationType,
  },
  HOSPITAL_APPLICATION_REJECTED: {
    title: 'Application Status',
    message: 'You have rejected a student application.',
    type: 'ALERT' as NotificationType,
  },
  HOSPITAL_MESSAGE_RECEIVED: {
    title: 'New Message',
    message: 'You have received a new message from a student.',
    type: 'ALERT' as NotificationType,
  },

  // Admin Notifications
  ADMIN_NEW_STUDENT_SIGNUP: {
    title: 'New Student Registration',
    message: 'A new student has registered on the platform.',
    type: 'ADMIN' as NotificationType,
  },
  ADMIN_NEW_HOSPITAL_SIGNUP: {
    title: 'New Hospital Registration',
    message: 'A new hospital has registered on the platform.',
    type: 'ADMIN' as NotificationType,
  },
  ADMIN_NEW_ENQUIRY: {
    title: 'New Placement Enquiry',
    message: 'A new student placement enquiry requires your review.',
    type: 'ADMIN' as NotificationType,
  },
  ADMIN_NEW_PLACEMENT: {
    title: 'New Placement Posted',
    message: 'A new placement has been posted by a hospital.',
    type: 'ADMIN' as NotificationType,
  },
  ADMIN_PAYMENT_RECEIVED: {
    title: 'Payment Received',
    message: 'A payment has been successfully processed.',
    type: 'PAYMENT' as NotificationType,
  },
  ADMIN_PAYMENT_FAILED: {
    title: 'Payment Failed',
    message: 'A payment transaction has failed.',
    type: 'ALERT' as NotificationType,
  },
};
