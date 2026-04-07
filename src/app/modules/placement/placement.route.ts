import express from 'express';
import { PlacementController } from './placement.controller';
import { PlacementValidation } from './placement.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/', auth(USER_ROLES.HOSPITAL), PlacementController.getPlacements);
router.post('/', auth(USER_ROLES.HOSPITAL, USER_ROLES.ADMIN), validateRequest(PlacementValidation.createPlacementZodSchema), PlacementController.createPlacement);

router.get('/:id', PlacementController.getPlacement);
router.patch('/:id', auth(USER_ROLES.HOSPITAL, USER_ROLES.ADMIN), validateRequest(PlacementValidation.updatePlacementZodSchema), PlacementController.updatePlacement);
router.delete('/:id', auth(USER_ROLES.HOSPITAL, USER_ROLES.ADMIN), PlacementController.deletePlacement);

export const PlacementRouter = router;
