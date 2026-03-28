import express from 'express';
import { EnquiryController } from './enquiry.controller';
import { EnquiryValidation } from './enquiry.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();


router.post('/', validateRequest(EnquiryValidation.createEnquiryZodSchema), EnquiryController.createEnquiry);



export const EnquiryRouter = router;
