import express from 'express';
import { FaqController } from './faq.controller';
import { FaqValidation } from './faq.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.ADMIN), validateRequest(FaqValidation.createFaqZodSchema), FaqController.createFaq);
router.get('/', FaqController.getFaqs);
router.get('/:id', validateRequest(FaqValidation.faqIdZodSchema), FaqController.getSingleFaq);
router.patch('/:id', auth(USER_ROLES.ADMIN), validateRequest(FaqValidation.updateFaqZodSchema), FaqController.updateFaq);
router.delete('/:id', auth(USER_ROLES.ADMIN), validateRequest(FaqValidation.faqIdZodSchema), FaqController.deleteFaq);

export const FaqRouter = router;
