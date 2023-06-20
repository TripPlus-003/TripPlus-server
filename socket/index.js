const Message = require('../models/messagesModel');
const Room = require('../models/roomsModel');
const Project = require('../models/projectsModel');
const appError = require('../services/appError');

// 建立 WebSocket 連接
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', function (roomId) {
      socket.join(roomId);
    });

    socket.on('message', async (messagePayload) => {
      const { sender, receiver, content, roomId } = messagePayload;
      if (!sender || !receiver || !content || !roomId) {
        return io.emit(
          'error',
          '以下欄位不可爲空：接收者 id、聊天訊息、room id 不可為空'
        );
      }
    });

    socket.on('leaveRoom', function (roomId) {
      socket.leave(roomId);
    });
  });
};
