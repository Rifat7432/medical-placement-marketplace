import colors from 'colors';
import { Server, Socket, DefaultEventsMap } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../app/modules/user/user.model';
import { Conversation } from '../app/modules/conversation/conversation.model';
import { Message } from '../app/modules/message/message.model';
import { logger } from '../shared/logger';

interface AuthenticatedSocket extends Socket {
     user?: any;
}
export let socketIo: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
const socket = (io: Server) => {
     socketIo = io;
     io.use(async (socket: AuthenticatedSocket, next) => {
          try {
               const token = socket.handshake.auth.token;
               if (!token) {
                    return next(new Error('Authentication error'));
               }

               const decoded = jwt.verify(token, config.jwt.jwt_secret as string);
               const user = await User.findById((decoded as any).id);
               if (!user) {
                    return next(new Error('User not found'));
               }

               socket.user = user;
               next();
          } catch (error) {
               next(new Error('Authentication error'));
          }
     });

     io.on('connection', (socket: AuthenticatedSocket) => {
          logger.info(colors.blue(`User ${socket.user.email} connected`));

          // Join conversation room
          socket.on('joinConversation', (conversationId: string) => {
               socket.join(conversationId);
               logger.info(`User ${socket.user.email} joined conversation ${conversationId}`);
          });

          // Leave conversation room
          socket.on('leaveConversation', (conversationId: string) => {
               socket.leave(conversationId);
               logger.info(`User ${socket.user.email} left conversation ${conversationId}`);
          });

          // Send message
          socket.on('sendMessage', async (data: { conversationId: string; content: string; attachments?: { url: string; type: string }[] }) => {
               try {
                    const { conversationId, content, attachments } = data;

                    // Check if conversation exists and user is participant
                    const conversation = await Conversation.findById(conversationId);
                    if (!conversation || !conversation.participants.includes(socket.user._id)) {
                         socket.emit('error', { message: 'Access denied' });
                         return;
                    }

                    // Create message
                    const message = await Message.create({
                         senderId: socket.user._id,
                         conversationId,
                         content,
                         attachments: attachments || [],
                    });

                    // Update conversation lastMessage
                    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

                    // Populate message
                    await message.populate('senderId', 'email role');

                    // Emit to all participants in the room
                    io.to(conversationId).emit('newMessage', message);
               } catch (error) {
                    socket.emit('error', { message: 'Failed to send message' });
               }
          });

          // Mark messages as read
          socket.on('markAsRead', async (data: { conversationId: string }) => {
               try {
                    await Message.updateMany({ conversationId: data.conversationId, senderId: { $ne: socket.user._id }, isRead: false }, { isRead: true });
                    socket.emit('messagesRead', { conversationId: data.conversationId });
               } catch (error) {
                    socket.emit('error', { message: 'Failed to mark as read' });
               }
          });

          // Disconnect
          socket.on('disconnect', () => {
               logger.info(colors.red(`User ${socket.user?.email} disconnected`));
          });
     });
};

export const socketHelper = { socket };
