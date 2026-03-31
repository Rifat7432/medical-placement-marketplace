import { z } from 'zod';

const createConversationZodSchema = z.object({
  body: z.object({
    participants: z.array(z.string()).min(1, 'At least one participant is required'),
  }),
});

const updateConversationZodSchema = z.object({
  body: z.object({
    participants: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ConversationValidation = {
  createConversationZodSchema,
  updateConversationZodSchema,
};