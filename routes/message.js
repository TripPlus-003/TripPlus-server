const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../services/auth');
const messagesController = require('../controllers/message');

router.get('/chatroom', isAuth, messagesController.getChatroom);
router.post('/chatroom', isAuth, messagesController.createChatroom);
router.get(
  '/message/member/:roomId',
  isAuth,
  messagesController.getMemberMessages
);
router.get(
  '/message/project/:projectId',
  isAuth,
  messagesController.getProjectMessages
);
router.get(
  '/message/admin_project/:projectId/:roomId',
  isAdmin,
  messagesController.getAdminProjectMessages
);

module.exports = router;
