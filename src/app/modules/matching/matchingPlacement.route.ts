import express from 'express';
import { MatchingPlacementController } from './matchingPlacement.controller';
import { MatchingPlacementValidation } from './matchingPlacement.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
     '/',
     auth(USER_ROLES.ADMIN, USER_ROLES.HOSPITAL),
     validateRequest(MatchingPlacementValidation.createMatchingPlacementZodSchema),
     MatchingPlacementController.createMatchingPlacement
);

router.get('/', auth(USER_ROLES.ADMIN), MatchingPlacementController.getMatchingPlacements);

router.get('/student/:studentId', auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT), MatchingPlacementController.getMatchingPlacementsByStudent);

router.get('/placement/:placementId', auth(USER_ROLES.ADMIN, USER_ROLES.HOSPITAL), MatchingPlacementController.getMatchingPlacementsByPlacement);

router.get('/enquiry/:enquiryId', auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.HOSPITAL), MatchingPlacementController.getMatchingPlacementByEnquiry);

router.get('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.STUDENT, USER_ROLES.HOSPITAL), MatchingPlacementController.getMatchingPlacement);

router.patch(
     '/:id',
     auth(USER_ROLES.ADMIN, USER_ROLES.HOSPITAL),
     validateRequest(MatchingPlacementValidation.updateMatchingPlacementZodSchema),
     MatchingPlacementController.updateMatchingPlacement
);

router.delete('/:id', auth(USER_ROLES.ADMIN), MatchingPlacementController.deleteMatchingPlacement);

export const MatchingPlacementRouter = router;