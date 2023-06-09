const express = require('express');
const router = express.Router();
const { isAuth } = require('../services/auth');
const UserController = require('../controllers/user');

router.get('/account', isAuth, UserController.getUser);
router.patch('/account', isAuth, UserController.editUser);
router.patch('/change-password', isAuth, UserController.updatePassword);
router.get('/follows', isAuth, UserController.getFollows);
router.post('/follow/:id', isAuth, UserController.addFollow);
router.delete('/follow/:id', isAuth, UserController.removeFollow);
router.get('/orders', isAuth, UserController.getOrders);
router.get('/order/:id', isAuth, UserController.getOrderDetails);
router.post('/order/:orderId/ranking', isAuth, UserController.createComment);
router.get('/bonus', isAuth, UserController.getBonus);

module.exports = router;
