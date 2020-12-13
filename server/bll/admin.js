const db = require('../db');
const model = require('../model');
const _ = require('underscore');
const utils = require('../utils');
const ResultInfo = require('../ResultInfo');
const setSuccess = ResultInfo.setSuccess;
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;
const createToken = require('../middleware/createToken');
const Joi = require('@hapi/joi');
const config = require('../config');

module.exports = {
  /**
   * @description 后台登录
   * @param {*} reqBody { username: '登录账号', password: '登录密码' }
   * @return {*} { name: '账号名称', username: '登录账号', mobile: '手机号', role: '账号角色', token: '登录凭证' }
   */
  login: [async function (reqBody, { ip }, callback) {
    const { username, password } = reqBody;
    const schema = Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const admin = await model.Admin.findOne({ $or: [{ mobile: username }, { username }], state: 0 });
    if (!admin) return callback(setError(ResCode.ERR_LOGIN_FAIL));
    if (!utils.checkPwd(password, admin.salt, admin.password)) return callback(setError(ResCode.ERR_LOGIN_FAIL));
    callback(setSuccess({ token: createToken({ _id: admin._id, ip }) }));
  }],
  /**
   * @description 添加管理账户
   * @param {*} reqBody { mobile: '登录账号', name: '账号名称', role: '账号角色' }
   * @param {*} user { _id: '账号ID', role: '账号角色',userId: '用户ID', level: '用户级别', ip }
   */
  add: async function (reqBody, user, callback) {
    if (!user._id || user.role != '1') return callback(setError(ResCode.ERR_NOPOWER));
    reqBody.role = '0';//普通管理员
    const { adminId, mobile, name, role, corpname } = reqBody;
    const schema = Joi.object().keys({
      adminId: Joi.string().allow('').required(),
      mobile: Joi.string().regex(config.phoneReg),
      name: Joi.string().required(),
      role: Joi.string().valid('0', '1'),
      corpname: Joi.string().allow('').required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    if (adminId) {//编辑
      await model.Admin.findByIdAndUpdate(adminId, { $set: { name, corpname } });
    } else {//添加
      const result = await db.addAdmin({ mobile, name, role, corpname });
      if (result.code != 0) return callback(result);
    }
    callback(setSuccess());
  },
  /**
   * @description 分页查询 管理账户
   * @param {*} reqBody { page, limit }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   * @return {*} { count: '总数据量', data: '本次查询数据', loadmore: '是否有更多数据' }
   */
  list: async function (reqBody, user, callback) {
    if (!user._id || user.role != '1') return callback(setError(ResCode.ERR_NOPOWER));
    const { page, limit } = reqBody;
    const schema = Joi.object().keys({
      page: Joi.number().min(1).required(),
      limit: Joi.number().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const where = { state: 0 };
    const order = { createdAt: -1 };
    const fields = { mobile: 1, name: 1, corpname: 1, role: 1, initpwd: 1 };
    const data = await list({ where, order, page, limit, fields });
    data.data.forEach(item => {
      item.removeable = item._id != user._id;
    });
    data.isAdmin = true;
    callback(setSuccess(data));
  },
  /**
   * @description 删除账户
   * @param {*} reqBody { _id: '账号ID' }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   */
  remove: async function (reqBody, user, callback) {
    if (!user._id || user.role != '1') return callback(setError(ResCode.ERR_NOPOWER));
    const { adminId } = reqBody;
    const schema = Joi.object().keys({
      adminId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    if (user._id == adminId) return callback(setError(ResCode.ERR_REMOVE_SELF));
    await model.Admin.findByIdAndUpdate(adminId, { $set: { state: 1, removeBy: user.userId, removeTime: new Date() } });
    callback(setSuccess());
  },
  info: async function (reqBody, user, callback) {
    if (!user._id) return callback(setSuccess({ isAdmin: false }));
    let admin = await model.Admin.findById(user._id);
    if (!admin || admin.state == 1) return callback(setSuccess({ isAdmin: false }));
    callback(setSuccess({ name: admin.name, role: admin.role, mobile: utils.hidePhone(admin.mobile), avatar: utils.makeAvatar(), isAdmin: true }));
  },
  info2: async function (reqBody, user, callback) {
    if (!user._id || user.role != '1') return callback(setError(ResCode.ERR_NOPOWER));
    const { adminId } = reqBody;
    const schema = Joi.object().keys({
      adminId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let admin = await model.Admin.findById(adminId, { name: 1, mobile: 1, corpname: 1, state: 1 });
    if (!admin || admin.state != 0) return callback(setError(ResCode.ERR_OBJECTNULL));
    admin = admin.toObject();
    callback(setSuccess(admin));
  },
  //修改密码
  updatepwd: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { oldpwd, newpwd } = reqBody;
    const schema = Joi.object().keys({
      oldpwd: Joi.string().required(),
      newpwd: Joi.string().max(20).required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let admin = await model.Admin.findById(user._id, { salt: 1, password: 1 });
    if (admin) {
      if (!utils.checkPwd(oldpwd, admin.salt, admin.password)) return callback(setError(ResCode.ERR_LOGIN_FAIL));
      var salt = utils.makeUUID();
      await model.Admin.updateOne({ _id: user._id }, { $set: { password: utils.getPwd(newpwd, salt), salt, initpwd: '密码已修改' } });
    }
    callback(setSuccess());
  },
  //重置密码
  resetpwd: async function (reqBody, user, callback) {
    if (!user._id || user.role != '1') return callback(setError(ResCode.ERR_NOPOWER));
    const { adminId, password } = reqBody;
    const schema = Joi.object().keys({
      adminId: Joi.string().required(),
      password: Joi.string().max(20).required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    var salt = utils.makeUUID();
    await model.Admin.findByIdAndUpdate(adminId, { $set: { password: utils.getPwd(password, salt), salt, initpwd: password } });
    callback(setSuccess());
  },
};

async function list({ where, order, page, limit, fields }, ) {
  let query = model.Admin.find(where);
  if (fields) query = query.select(fields);
  if (page && limit) query = query.skip((page - 1) * limit).limit(limit);
  if (order) query = query.sort(order);
  const data = await query.exec();
  const count = await model.Admin.countDocuments(where);
  const loadmore = count > 0 && ((page - 1) * limit + data.length) < count;
  return utils.ResObj({ count, data: _.map(data, (n) => n.toObject()), loadmore });
}