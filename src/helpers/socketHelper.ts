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
               const token = socket.handshake.query.token as string;
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
          } catch (err) {
               next(new Error('Authentication error'));
          }
     });

     // =========================
     // CONNECTION
     // =========================
     io.on('connection', (socket: AuthenticatedSocket) => {
          logger.info(colors.blue(`User ${socket.user.email} connected`));
          socket.join(socket.user._id.toString());
          // JOIN ROOM
          socket.on('joinConversation', (conversationId: string) => {
               socket.join(conversationId);
          });

          // LEAVE ROOM
          socket.on('leaveConversation', (conversationId: string) => {
               socket.leave(conversationId);
          });

          // =========================
          // SEND MESSAGE
          // =========================
          socket.on('sendMessage', async (data) => {
               try {
                    const { conversationId, content, attachments } = data;
                    const conversation = await Conversation.findById(conversationId);
                    const isParticipant = conversation?.participants.some((id: any) => id.toString() === socket.user._id.toString());

                    if (!conversation || !isParticipant) {
                         socket.emit('auth_error', { message: 'Access denied' });
                         return;
                    }

                    const message = await Message.create({
                         senderId: socket.user._id,
                         conversationId,
                         content,
                         attachments: attachments || [],
                    });

                    await Conversation.findByIdAndUpdate(conversationId, {
                         lastMessage: message._id,
                    });

                    await message.populate('senderId', 'email role');

                    io.to(conversationId).emit('newMessage', message);
               } catch (err) {
                    socket.emit('auth_error', {
                         message: 'Failed to send message',
                    });
               }
          });

          // =========================
          // MARK AS READ
          // =========================
          socket.on('markAsRead', async (data) => {
               try {
                    await Message.updateMany(
                         {
                              conversationId: data.conversationId,
                              senderId: { $ne: socket.user._id },
                              isRead: false,
                         },
                         { isRead: true },
                    );

                    socket.emit('messagesRead', {
                         conversationId: data.conversationId,
                    });
               } catch (err) {
                    socket.emit('auth_error', {
                         message: 'Failed to mark as read',
                    });
               }
          });

          // DISCONNECT
          socket.on('disconnect', () => {
               logger.info(colors.red(`User disconnected`));
          });
     });
};

export const socketHelper = { socket };
