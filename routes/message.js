const express = require('express');
const router = express.Router();
const { isAuth, isAdmin } = require('../services/auth');
const messagesController = require('../controllers/message');

router.post('/', isAuth, messagesController.createMessages);
router.get('/member', isAuth, messagesController.getMemberMessages);
router.get(
  '/project/:projectId',
  isAdmin,
  messagesController.getProjectMessages
);
module.exports = router;