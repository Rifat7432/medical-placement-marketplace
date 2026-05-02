import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { StudentRouter } from '../app/modules/student/student.route';
import { HospitalRouter } from '../app/modules/hospital/hospital.route';
import { PlacementRouter } from '../app/modules/placement/placement.route';
import { StudentPlacementEnquiryRouter } from '../app/modules/studentPlacementEnquiry/studentPlacementEnquiry.route';
import { EnquiryRouter } from '../app/modules/enquiry/enquiry.route';
import { PlacementsEnquiryRouter } from '../app/modules/placementsEnquiry/placementsEnquiry.route';
import { MessageRouter } from '../app/modules/message/message.route';
import { ConversationRouter } from '../app/modules/conversation/conversation.route';
import { MatchingPlacementRouter } from '../app/modules/matching/matchingPlacement.route';
import { NotificationRoutes } from '../app/modules/notification/notification.routes';
import { SubscriptionRoutes } from '../app/modules/payment/payment.routes';
import { AdminRouter } from '../app/modules/admin/admin.route';

const router = express.Router();
const routes = [
     {
          path: '/auth',
          route: AuthRouter,
     },
     {
          path: '/users',
          route: UserRouter,
     },
     {
          path: '/students',
          route: StudentRouter,
     },
     {
          path: '/hospitals',
          route: HospitalRouter,
     },
     {
          path: '/placements',
          route: PlacementRouter,
     },
     {
          path: '/student-placement-enquiries',
          route: StudentPlacementEnquiryRouter,
     },
     {
          path: '/enquiries',
          route: EnquiryRouter,
     },
     {
          path: '/placements-enquiries',
          route: PlacementsEnquiryRouter,
     },
     {
          path: '/messages',
          route: MessageRouter,
     },
     {
          path: '/conversations',
          route: ConversationRouter,
     },
     {
          path: '/matching-placements',
          route: MatchingPlacementRouter,
     },
     {
          path: '/notifications',
          route: NotificationRoutes,
     },
     {
          path: '/payments',
          route: SubscriptionRoutes,
     },
     {
          path: '/admin',
          route: AdminRouter,
     },
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
