import express from 'express';
import { PlacementController } from './placement.controller';
import { PlacementValidation } from './placement.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.route('/').get(PlacementController.getPlacements).post(validateRequest(PlacementValidation.createPlacementZodSchema), PlacementController.createPlacement);

router.route('/:id').get(PlacementController.getPlacement).patch(validateRequest(PlacementValidation.updatePlacementZodSchema), PlacementController.updatePlacement).delete(PlacementController.deletePlacement);

export const PlacementRouter = router;