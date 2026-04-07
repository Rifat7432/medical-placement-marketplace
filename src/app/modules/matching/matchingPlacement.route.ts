import express from 'express';
import { MatchingPlacementController } from './matchingPlacement.controller';
import { MatchingPlacementValidation } from './matchingPlacement.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.ADMIN, USER_ROLES.HOSPITAL), validateRequest(MatchingPlacementValidation.createMatchingPlacementZodSchema), MatchingPlacementController.createMatchingPlacement);

export const MatchingPlacementRouter = router;
