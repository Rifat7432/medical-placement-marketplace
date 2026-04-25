import express from 'express';
import { HospitalController } from './hospital.controller';
import { HospitalValidation } from './hospital.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/', auth(USER_ROLES.ADMIN), HospitalController.getHospitals);

router.get('/profile', auth(USER_ROLES.HOSPITAL), HospitalController.getHospitalProfile);

// router.get('/:id', HospitalController.getHospital);
// router.patch('/:id', validateRequest(HospitalValidation.updateHospitalZodSchema), HospitalController.updateHospital);
// router.delete('/:id', HospitalController.deleteHospital);

export const HospitalRouter = router;
