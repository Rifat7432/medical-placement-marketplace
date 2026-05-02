import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';
import validateRequest from '../../middleware/validateRequest';
import { adminValidation } from './admin.validation';

const router = express.Router();

router.patch('/change-student-placement-enquiry-status/:id', auth(USER_ROLES.ADMIN), validateRequest(adminValidation.verifyStatusZodSchema), AdminController.changeStudentPlacementEnquiryStatus);
router.patch('/change-student-placement-enquiry-stage/:id', auth(USER_ROLES.ADMIN), AdminController.changeStudentPlacementEnquiryStage);
router.get('/admin-overview', auth(USER_ROLES.ADMIN), AdminController.adminOverview);

export const AdminRouter = router;
