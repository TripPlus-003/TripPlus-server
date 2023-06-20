const {
  createMessages,
  getMemberMessages,
  getProjectMessages,
  getAdminProjectMessages
} = require('./message');
const { createChatroomRoom, getChatroomMessage } = require('./chatRoom');

module.exports.createMessages = createMessages;
module.exports.getMemberMessages = getMemberMessages;
module.exports.getProjectMessages = getProjectMessages;
module.exports.getAdminProjectMessages = getAdminProjectMessages;
module.exports.createChatroomRoom = createChatroomRoom;
module.exports.getChatroomMessage = getChatroomMessage;
