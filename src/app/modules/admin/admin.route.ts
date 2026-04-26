import express from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.post('/change-student-placement-enquiry-status', AdminController.changeStudentPlacementEnquiryStatus);

export const AdminRouter = router;
