import { io, type Socket } from 'socket.io-client';
import { env } from './env';

/**
 * Shared Socket.IO client for the survey chat feature. Connects once as an
 * admin (query role=admin) and is reused across the Survey Responses pages.
 */
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(env.socketUrl, {
      query: { role: 'admin' },
      transports: ['websocket'],
    });
  }
  return socket;
}
