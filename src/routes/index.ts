import express from 'express';
import { UserRouter } from '../app/modules/user/user.route';
import { AuthRouter } from '../app/modules/auth/auth.route';
import { StudentRouter } from '../app/modules/student/student.route';
import { HospitalRouter } from '../app/modules/hospital/hospital.route';
import { PlacementRouter } from '../app/modules/placement/placement.route';
import { StudentPlacementEnquiryRouter } from '../app/modules/studentPlacementEnquiry/studentPlacementEnquiry.route';
import { ApplicationRouter } from '../app/modules/application/application.route';
import { EnquiryRouter } from '../app/modules/enquiry/enquiry.route';
import { PlacementsEnquiryRouter } from '../app/modules/placementsEnquiry/placementsEnquiry.route';
import { MessageRouter } from '../app/modules/message/message.route';

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
          path: '/applications',
          route: ApplicationRouter,
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
];

routes.forEach((element) => {
     if (element?.path && element?.route) {
          router.use(element?.path, element?.route);
     }
});

export default router;
