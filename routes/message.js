const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../services/auth');
const messagesController = require('../controllers/message');

router.get('/chatroom', isAuth, messagesController.getChatroomMessage);
router.post('/chatroom', isAuth, messagesController.createChatroomRoom);
router.get('/message/member', isAuth, messagesController.getMemberMessages);
router.get(
  '/message/project/:projectId',
  isAuth,
  messagesController.getProjectMessages
);
router.get(
  '/message/admin_project/:projectId',
  isAdmin,
  messagesController.getAdminProjectMessages
);
router.post('/message', isAuth, messagesController.createMessages);

module.exports = router;
