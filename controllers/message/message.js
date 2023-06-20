const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Message = require('../../models/messagesModel');
const Room = require('../../models/roomsModel');
const Project = require('../../models/projectsModel');

const createMessages = handleErrorAsync(async (req, res, next) => {
  const { receiver, content, projectId, roomId } = req.body;
  const { id } = req.user;
  if (!receiver || !content || !roomId) {
    return next(
      appError(400, '以下欄位不可爲空：接收者 id、聊天訊息、專案 id 不可為空')
    );
  }
  const newMessage = await Message.create({
    sender: id,
    receiver,
    roomId
  });
  if (!newMessage) {
    return next(appError(500, '新增訊息失敗'));
  }
  successHandler(res, '新增訊息成功', newMessage);
});

const getMemberMessages = handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  const messages = await Message.find({
    $or: [{ sender: id }, { receiver: id }]
  })
    .populate({
      path: 'sender',
      select: 'name nickName photo'
    })
    .populate({
      path: 'receiver',
      select: 'name nickName photo'
    })
    .populate({
      path: 'roomId',
      populate: {
        path: 'projectId',
        select: 'title creator'
      }
    })
    .sort({ createdAt: -1 });

  const groupedMessages = {};
  messages.forEach((message) => {
    const projectId = message.roomId.projectId._id.toString();
    if (!groupedMessages[projectId]) {
      groupedMessages[projectId] = [];
    }
    groupedMessages[projectId].push(message);
  });

  successHandler(res, '取得訊息', groupedMessages);
});
const getProjectMessages = handleErrorAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { id } = req.user;
  if (!projectId || !ObjectId.isValid(projectId)) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(appError(400, '查無此專案'));
  }
  const room = await Room.findOne({
    projectId: projectId,
    participants: { $in: [id] }
  });
  if (!room) {
    return next(appError(400, '查無聊天室'));
  }
  const messages = await Message.find({
    roomId: room._id,
    $or: [{ sender: id }, { receiver: id }]
  })
    .populate({
      path: 'sender',
      select: 'name nickName photo'
    })
    .populate({
      path: 'receiver',
      select: 'name nickName photo'
    })
    .populate({
      path: 'roomId',
      populate: {
        path: 'projectId',
        select: 'title creator teamId',
        populate: {
          path: 'teamId',
          select: 'title'
        }
      }
    })
    .sort({ createdAt: -1 });

  if (!messages || messages.length === 0) {
    return next(appError(500, '查無相關訊息'));
  }
  if (!messages) {
    return next(appError(500, '查無相關訊息'));
  }
  successHandler(res, '取得訊息', messages);
});
const getAdminProjectMessages = handleErrorAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { id } = req.user;
  if (!projectId || !ObjectId.isValid(projectId)) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(appError(400, '查無此專案'));
  }
  const room = await Room.findOne({
    projectId: projectId,
    participants: { $in: [id] }
  });
  if (!room) {
    return next(appError(400, '查無聊天室'));
  }
  const messages = await Message.find({
    roomId: room._id,
    $or: [{ sender: id }, { receiver: id }]
  })
    .populate({
      path: 'sender',
      select: 'name nickName photo'
    })
    .populate({
      path: 'receiver',
      select: 'name nickName photo'
    })
    .populate({
      path: 'roomId',
      populate: {
        path: 'projectId',
        select: 'title creator'
      }
    })
    .sort({ createdAt: -1 });

  if (!messages || messages.length === 0) {
    return next(appError(500, '查無相關訊息'));
  }
  if (!messages) {
    return next(appError(500, '查無相關訊息'));
  }

  const groupedMessages = messages.reduce((groups, message) => {
    const roomId = message.roomId.toString();
    if (!groups[roomId]) {
      groups[roomId] = [];
    }
    groups[roomId].push(message);
    return groups;
  }, {});

  const groupedMessagesArray = Object.values(groupedMessages);

  successHandler(res, '取得訊息', groupedMessagesArray);
});

module.exports = {
  createMessages,
  getMemberMessages,
  getProjectMessages,
  getAdminProjectMessages
};
