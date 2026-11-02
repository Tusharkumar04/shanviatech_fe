const { Server } = require('socket.io');
const logger = require('../config/logger');
const surveyResponseService = require('../services/surveyResponse.service');

let io;

const getAdminCount = (server) => server.sockets.adapter.rooms.get('admin_room')?.size || 0;

const initSocket = (httpServer) => {
  // Reuse the same allow-list as the HTTP API (CORS_ORIGINS). Falls back to '*'
  // only if the env var is unset, so realtime never hard-breaks on a bad deploy.
  const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((url) => url.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : '*',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    const role = socket.handshake.query.role;
    logger.info(`Socket connected: ${socket.id}${role === 'admin' ? ' (admin)' : ''}`);

    if (role === 'admin') {
      socket.join('admin_room');
    }

    // IMPORTANT: register all event handlers synchronously, BEFORE any await.
    // The client emits `joinRoom` immediately on connect; if we awaited first,
    // that event would arrive before the handler exists and be silently dropped,
    // so the visitor would never join their room and admin→user (room-targeted)
    // messages would never be delivered.

    socket.on('joinRoom', ({ guestId } = {}) => {
      if (!guestId) return;
      socket.join(guestId);
    });

    socket.on('newVisit', async ({ uid } = {}) => {
      if (!uid) return;
      const response = await surveyResponseService.createNewSurvey(uid);
      io.emit('new_visit', {
        uid,
        isNewVisit: true,
        responseId: response?.details?._id,
      });
    });

    socket.on('messageToAdmin', async (payload = {}) => {
      const response = await surveyResponseService.saveChatMessage(payload.guestId, payload.text, 'user');
      io.emit('message_for_admin', {
        ...payload,
        responseId: payload?.responseId ? payload.responseId : response?.responseId,
      });
    });

    socket.on('messageToUser', async (payload = {}) => {
      io.to(payload?.uid).emit('message_from_admin', payload);
      await surveyResponseService.saveChatMessage(payload.uid, payload.message, 'admin');
    });

    socket.on('set_admin_status', async (payload = {}) => {
      io.emit('admin_online', payload?.status);
      await surveyResponseService.updateOnlineStatus(payload?.status);
    });

    socket.on('get_admin_online_status', async () => {
      const adminSetting = await surveyResponseService.findSiteSetting();
      io.emit('admin_online', adminSetting?.isAdminOnline);
    });

    socket.on('markChatAsSeen', async (payload = {}) => {
      if (payload.seenBy === 'user') {
        // User viewed admin's messages -> tell admin (double tick on admin side).
        io.emit('seen_by_user', payload);
      } else if (payload.seenBy === 'admin') {
        // Admin viewed user's messages -> tell that user (double tick on user side).
        io.to(payload.uid).emit('seen_by_admin', payload);
      }
      await surveyResponseService.markChatAsSeen(payload.uid, payload.seenBy);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      if (role === 'admin' && getAdminCount(io) === 0) {
        io.emit('admin_online', false);
      }
    });

    // Handlers are registered above; now broadcast current admin presence
    // asynchronously (no await before handler registration).
    (async () => {
      try {
        const adminSetting = await surveyResponseService.findSiteSetting();
        const adminCount = getAdminCount(io);
        io.emit('admin_online', adminCount > 0 && adminSetting?.isAdminOnline);
      } catch (error) {
        logger.error(error);
      }
    })();
  });

  return io;
};

const getIo = () => io;

module.exports = { initSocket, getIo };
