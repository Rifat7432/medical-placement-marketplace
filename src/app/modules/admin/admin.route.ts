import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/change-student-placement-enquiry-status',auth(USER_ROLES.ADMIN), AdminController.changeStudentPlacementEnquiryStatus);
router.get('/admin-overview', auth(USER_ROLES.ADMIN), AdminController.adminOverview);

export const AdminRouter = router;
