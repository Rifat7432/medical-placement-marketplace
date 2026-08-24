import express from 'express';
import { FaqController } from './faq.controller';
import { FaqValidation } from './faq.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';

const router = express.Router();

router.post('/', auth('admin'), validateRequest(FaqValidation.createFaqZodSchema), FaqController.createFaq);
router.get('/', FaqController.getFaqs);
router.get('/:id', FaqController.getSingleFaq);

export const FaqRouter = router;
