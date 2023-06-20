const {
  getMemberMessages,
  getProjectMessages,
  getAdminProjectMessages
} = require('./message');
const { createChatroom, getChatroom } = require('./chatRoom');

module.exports.getMemberMessages = getMemberMessages;
module.exports.getProjectMessages = getProjectMessages;
module.exports.getAdminProjectMessages = getAdminProjectMessages;
module.exports.createChatroom = createChatroom;
module.exports.getChatroom = getChatroom;
