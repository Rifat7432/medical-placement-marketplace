import express from 'express';
import { StudentPlacementEnquiryController } from './studentPlacementEnquiry.controller';
import { StudentPlacementEnquiryValidation } from './studentPlacementEnquiry.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.route('/').get(StudentPlacementEnquiryController.getStudentPlacementEnquiries).post(validateRequest(StudentPlacementEnquiryValidation.createStudentPlacementEnquiryZodSchema), StudentPlacementEnquiryController.createStudentPlacementEnquiry);

router.route('/:id').get(StudentPlacementEnquiryController.getStudentPlacementEnquiry).patch(validateRequest(StudentPlacementEnquiryValidation.updateStudentPlacementEnquiryZodSchema), StudentPlacementEnquiryController.updateStudentPlacementEnquiry).delete(StudentPlacementEnquiryController.deleteStudentPlacementEnquiry);

export const StudentPlacementEnquiryRouter = router;