const User = require('../../models/usersModel');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');

const getUser = handleErrorAsync(async (req, res, next) => {
  if (!req.user) {
    return next(appError(403, '您沒有權限'));
  }
  successHandler(res, '取得使用者資料', req.user);
});

module.exports = { getUser };
