import { z } from 'zod';

const createMessageZodSchema = z.object({
  body: z.object({
    receiverId: z.string().optional(),
    conversationId: z.string({ required_error: 'Conversation ID is required' }),
    content: z.string({ required_error: 'Content is required' }),
    attachments: z.array(z.object({
      url: z.string(),
      type: z.string()
    })).optional(),
    isRead: z.boolean().default(false).optional(),
  }),
});

const updateMessageZodSchema = z.object({
  body: z.object({
    receiverId: z.string().optional(),
    conversationId: z.string().optional(),
    content: z.string().optional(),
    attachments: z.array(z.object({
      url: z.string(),
      type: z.string()
    })).optional(),
    isRead: z.boolean().optional(),
  }),
});

export const MessageValidation = {
  createMessageZodSchema,
  updateMessageZodSchema,
};