const express = require('express');
const router = express.Router();
const { isAuth } = require('../services/auth');
const UserController = require('../controllers/user');

router.get('/account', isAuth, UserController.getUser);

module.exports = router;
