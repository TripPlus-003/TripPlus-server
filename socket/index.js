const Message = require('../models/messagesModel');
const Room = require('../models/roomsModel');
const Project = require('../models/projectsModel');
const appError = require('../services/appError');

// 建立 WebSocket 連接
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('createChatroom', async (payload) => {
      const { userId, receiver, projectId } = payload;
      if (!receiver || !projectId) {
        return socket.emit('error', '請提供使用者 ID 和專案 ID');
      }
      const existingRoom = await Room.findOne({
        $and: [
          {
            participants: req.user
          },
          { projectId: projectId }
        ]
      });

      if (existingRoom) {
        return next(appError(400, 'Room 已存在'));
      }
      const project = await Project.findById(projectId);
      try {
        const newRoom = await Room.create({
          participants: [id, receiver],
          projectId,
          projectCreator: project.creator
        });
      } catch (error) {
        io.emit('error', error.message);
        return;
      }
      io.emit('chatroomCreated', room);
    });

    socket.on('joinRoom', function (roomId) {
      socket.join(roomId);
    });

    socket.on('message', async (messagePayload) => {
      const { sender, receiver, content, roomId } = messagePayload;
      if (!sender || !receiver || !content) {
        return io.emit(
          'error',
          '以下欄位不可爲空：接收者 id、聊天訊息、room id 不可為空'
        );
      }
      const room = await Room.findById(roomId);
      if (!room) {
        return socket.emit('error', '房間不存在');
      }

      try {
        const message = await Message.create({
          sender,
          receiver,
          content,
          roomId
        });
        io.to(roomId).emit('roomMessage', {
          ...messagePayload
        });
      } catch (error) {
        io.emit(error);
      }
    });

    socket.on('leaveRoom', function (roomId) {
      socket.leave(roomId);
    });
  });
};
