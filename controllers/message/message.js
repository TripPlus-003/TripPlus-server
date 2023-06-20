const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const isPositiveInteger = require('../../helper/isPositiveInteger');
const Message = require('../../models/messagesModel');
const Room = require('../../models/roomsModel');
const Project = require('../../models/projectsModel');

const defaultPageSize = 10;
const defaultPageIndex = 1;

const createMessages = handleErrorAsync(async (req, res, next) => {
  const { receiver, content, projectId, roomId } = req.body;
  const { id } = req.user;
  const { pageIndex, pageSize } = req.query;
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
  const { roomId } = req.params;
  const { pageIndex, pageSize } = req.query;
  const currentPageIndex = isPositiveInteger(pageIndex)
    ? pageIndex
    : defaultPageIndex;
  const currentPageSize = isPositiveInteger(pageSize)
    ? pageSize
    : defaultPageSize;
  const messages = await Message.find({
    $and: [
      { roomId },
      {
        $or: [{ sender: id }, { receiver: id }]
      }
    ]
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
    .sort({ createdAt: -1 })
    .skip((currentPageIndex - 1) * currentPageSize)
    .limit(currentPageSize);

  successHandler(res, '取得訊息', messages);
});
const getProjectMessages = handleErrorAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { id } = req.user;
  const { pageIndex, pageSize } = req.query;
  const currentPageIndex = isPositiveInteger(pageIndex)
    ? pageIndex
    : defaultPageIndex;
  const currentPageSize = isPositiveInteger(pageSize)
    ? pageSize
    : defaultPageSize;
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
    $and: [
      { roomId: room.id },
      {
        $or: [{ sender: id }, { receiver: id }]
      }
    ]
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
    .sort({ createdAt: -1 })
    .skip((currentPageIndex - 1) * currentPageSize)
    .limit(currentPageSize);

  if (!messages || messages.length === 0) {
    return next(appError(500, '查無相關訊息'));
  }
  if (!messages) {
    return next(appError(500, '查無相關訊息'));
  }
  successHandler(res, '取得訊息', messages);
});
const getAdminProjectMessages = handleErrorAsync(async (req, res, next) => {
  const { projectId, roomId } = req.params;
  const { id } = req.user;
  const { pageIndex, pageSize } = req.query;
  const currentPageIndex = isPositiveInteger(pageIndex)
    ? pageIndex
    : defaultPageIndex;
  const currentPageSize = isPositiveInteger(pageSize)
    ? pageSize
    : defaultPageSize;
  if (
    !projectId ||
    !ObjectId.isValid(projectId) ||
    !roomId ||
    !ObjectId.isValid(roomId)
  ) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(appError(400, '查無此專案'));
  }
  const room = await Room.findById(roomId);
  if (!room) {
    return next(appError(400, '查無聊天室'));
  }
  const messages = await Message.find({
    $and: [
      { roomId },
      {
        $or: [{ sender: id }, { receiver: id }]
      }
    ]
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
    .sort({ createdAt: -1 })
    .skip((currentPageIndex - 1) * currentPageSize)
    .limit(currentPageSize);

  if (!messages || messages.length === 0) {
    return next(appError(500, '查無相關訊息'));
  }
  if (!messages) {
    return next(appError(500, '查無相關訊息'));
  }
  successHandler(res, '取得訊息', messages);
});

module.exports = {
  createMessages,
  getMemberMessages,
  getProjectMessages,
  getAdminProjectMessages
};
