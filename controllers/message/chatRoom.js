const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Room = require('../../models/roomsModel');
const Message = require('../../models/messagesModel');
const Project = require('../../models/projectsModel');

const createChatroomRoom = handleErrorAsync(async (req, res, next) => {
  const { receiver, projectId } = req.body;

  if (!receiver || !projectId) {
    return next(appError(400, '以下欄位不可為空：接收者 ID、專案 ID 不可為空'));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(appError(400, '查無此專案'));
  }

  const existingRoom = await Room.findOne({
    $and: [
      {
        participants: req.user
      },
      { projectId: projectId }
    ]
  });

  if (existingRoom !== null) {
    return next(appError(400, 'Room 已存在'));
  }

  const newRoom = await Room.create({
    participants: [req.user, receiver],
    projectId,
    projectCreator: project.creator
  });

  if (!newRoom) {
    return next(appError(400, '新增 Room 失敗'));
  }
  successHandler(res, '新增 Room 成功', newRoom);
});
const getChatroomMessage = handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  const chatRooms = await Room.find({
    participants: id
  });
  if (!chatRooms) {
    return next(appError(400, '查無聊天訊息'));
  }
  const messages = await Message.find({
    roomId: chatRooms.id
  })
    .populate({
      path: 'sender',
      select: 'name nickName photo'
    })
    .populate({
      path: 'receiver',
      select: 'name nickName photo'
    })
    .sort({ createdAt: -1 })
    .limit(1);

  successHandler(res, '取得 Room 成功', messages);
});
module.exports = { createChatroomRoom, getChatroomMessage };
