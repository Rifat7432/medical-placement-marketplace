import express from 'express';
import { ConversationController } from './conversation.controller';
import { ConversationValidation } from './conversation.validation';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();


router.get('/user', auth(USER_ROLES.ADMIN,USER_ROLES.STUDENT,USER_ROLES.HOSPITAL), ConversationController.getConversations);
router.post('/',auth(USER_ROLES.ADMIN,USER_ROLES.STUDENT,USER_ROLES.HOSPITAL), validateRequest(ConversationValidation.createConversationZodSchema), ConversationController.createConversation);

router.get('/:conversationId/messages',auth(USER_ROLES.ADMIN,USER_ROLES.STUDENT,USER_ROLES.HOSPITAL), ConversationController.getMessagesFromConversation);

// router.patch('/:id', validateRequest(ConversationValidation.updateConversationZodSchema), ConversationController.updateConversation);
// router.delete('/:id', ConversationController.deleteConversation);

export const ConversationRouter = router;