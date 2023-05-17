const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Order = require('../../models/ordersModel');
const User = require('../../models/usersModel');

const handleReadProjDashboard = handleErrorAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);

  if (!proj) {
    return next(appError(400, '取得專案 Dashboard 資料失敗，查無專案'));
  }

  if (proj.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無此瀏覽專案的 Dashboard 權限'));
  }

  const orders = await Order.find({ projectId: req.params.id });
  const followers = await User.find({
    follows: { $elemMatch: { projectId: req.params.id } }
  });

  if (!orders || !followers) {
    return next(appError(500, '取得專案 Dashboard 資料失敗'));
  }

  const countDownDays = Math.round(
    (Date.parse(proj.endTime) - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const result = {
    id: req.params.id,
    projectTitle: proj.title,
    accumulatedAmount: proj.sum, //累計贊助金額
    targetAmount: proj.target, //募資目標金額
    accumulatedSponsor: proj.sponsorCount, //累計贊助人數
    followerAmount: followers.length, //活動追蹤人數
    unpaidOrder: orders.filter((x) => x.paymentStatus === 0).length, //待付款訂單
    paidOrder: orders.filter((x) => x.paymentStatus === 1).length, //已付款訂單
    shipedOrder: orders.filter((x) => x.shipmentStatus > 0).length, //已出貨訂單
    progressRate: Math.round((proj.sum / proj.target) * 100), //募資進度 %
    countDownDays: countDownDays > 0 ? countDownDays : 0 //倒數天數
  };

  successHandler(res, '取得專案 dashboard 資料成功', result);
});

module.exports = handleReadProjDashboard;