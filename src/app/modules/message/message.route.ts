import express from 'express';
import { MessageController } from './message.controller';
import { MessageValidation } from './message.validation';
import validateRequest from '../../middleware/validateRequest';

const router = express.Router();

router.route('/').get(MessageController.getMessages).post(validateRequest(MessageValidation.createMessageZodSchema), MessageController.createMessage);

router.route('/:id').get(MessageController.getMessage).patch(validateRequest(MessageValidation.updateMessageZodSchema), MessageController.updateMessage).delete(MessageController.deleteMessage);

export const MessageRouter = router;