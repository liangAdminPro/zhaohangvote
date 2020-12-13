// 创建 token
// token 单点登录具体理解： http://www.tuicool.com/articles/uuAzAbU
const jwt = require('jsonwebtoken');
const config = require('../config');
const utils = require('../utils');

module.exports = function (data) {
  // 为方便测试，有效期设置为 60s 进行监测，普通生产情况下可以设置为更长的时间
  const token = jwt.sign(data, config.jwt_secret, { expiresIn: config.jwt_expire });
  return utils.AesEncode(token, config.key);
}
