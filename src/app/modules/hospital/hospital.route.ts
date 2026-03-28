import express from 'express';
import { HospitalController } from './hospital.controller';
import { HospitalValidation } from './hospital.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.route('/').get(HospitalController.getHospitals).post(validateRequest(HospitalValidation.createHospitalZodSchema), HospitalController.createHospital);

router.route('/:id').get(HospitalController.getHospital).patch(validateRequest(HospitalValidation.updateHospitalZodSchema), HospitalController.updateHospital).delete(HospitalController.deleteHospital);

export const HospitalRouter = router;