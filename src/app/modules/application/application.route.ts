import express from 'express';
import { ApplicationController } from './application.controller';
import { ApplicationValidation } from './application.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.route('/').get(ApplicationController.getApplications).post(validateRequest(ApplicationValidation.createApplicationZodSchema), ApplicationController.createApplication);

router.route('/:id').get(ApplicationController.getApplication).patch(validateRequest(ApplicationValidation.updateApplicationZodSchema), ApplicationController.updateApplication).delete(ApplicationController.deleteApplication);

export const ApplicationRouter = router;