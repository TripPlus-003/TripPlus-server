const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');
const Order = require('../../models/ordersModel');

const getOrders = handleErrorAsync(async (req, res, next) => {
  const orders = await Order.find({ member: req.user.id })
    .populate({
      path: 'projectId',
      select: 'title keyVision',
      populate: {
        path: 'teamId',
        select: 'title'
      }
    })
    .populate({
      path: 'productId',
      select: 'title keyVision',
      populate: {
        path: 'teamId',
        select: 'title'
      }
    })
    .populate({
      path: 'planId',
      select: 'title price'
    });
  if (!orders) {
    return next(appError(400, '查無此訂單'));
  }
  successHandler(res, '取得訂單資料成功', orders);
});

const getOrderDetails = handleErrorAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(appError(400, '查無此訂單'));
  }
  const order = await Order.findById(id)
    .populate({
      path: 'projectId',
      select: 'title keyVision'
    })
    .populate({
      path: 'productId',
      select: 'title keyVision'
    })
    .populate({
      path: 'planId',
      select: 'title price'
    });
  if (order.member?.toString() !== req.user.id) {
    return next(appError(403, '您無權限查看'));
  }
  if (!order) {
    return next(appError(400, '查無此訂單'));
  }
  successHandler(res, '取得訂單資訊成功', order);
});

module.exports = { getOrders, getOrderDetails };
