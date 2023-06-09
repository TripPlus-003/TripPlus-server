const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');
const Team = require('../../models/teamsModel');

const getTeam = handleErrorAsync(async (req, res, next) => {
  const { productId, teamId } = req.params;
  if (
    !productId ||
    !ObjectId.isValid(productId) ||
    !teamId ||
    !ObjectId.isValid(teamId)
  ) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  if (product.creator?.toString() !== req.user.id) {
    return next(appError(403, '您無權限瀏覽商品團隊'));
  }
  const team = await Team.findById(teamId);
  if (!product) {
    return next(appError(400, '查無此商品'));
  }
  if (product.teamId.toString() !== teamId) {
    return next(appError(400, '商品或團隊資料錯誤'));
  }
  if (!team) {
    return next(appError(400, '取得團隊資料失敗'));
  }
  successHandler(res, '取得團隊資料成功', team);
});
module.exports = getTeam;
