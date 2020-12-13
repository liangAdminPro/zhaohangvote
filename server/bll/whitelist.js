const model = require('../model');
const _ = require('underscore');
const utils = require('../utils');
const ResultInfo = require('../ResultInfo');
const setSuccess = ResultInfo.setSuccess;
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;
const Joi = require('@hapi/joi');

module.exports = {
  /**
   * @description 白名单列表
   * @param {*} reqBody { voteId, page, limit }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   * @return {*} { count: '总数据量', data: '本次查询数据', loadmore: '是否有更多数据' }
   */
  list: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId, page, limit } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().allow('').required(),
      page: Joi.number().min(1).required(),
      limit: Joi.number().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const where = { state: 0 };
    if (voteId) where.voteId = voteId;
    const order = { createdAt: -1 };
    const fields = { phone: 1, idno: 1, name: 1, birth: 1, level: 1 };
    const data = await list({ where, order, page, limit, fields });
    data.data.forEach(item => {
      item.phone = utils.hidePhone(item.phone);
      item.idno = utils.hideID(item.idno);
    });
    callback(setSuccess(data));
  },
  remove: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { _id } = reqBody;
    const schema = Joi.object().keys({
      _id: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    await model.WhiteList.findByIdAndUpdate(_id, { $set: { state: 1, removeBy: user.userId, removeTime: new Date() } });
    callback(setSuccess());
  },
  /**
   * @description 添加白名单
   * @param {*} reqBody { voteId, name, phone, idno, birth }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   */
  add: function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { _id, voteId, name, phone, idno, birth, level } = reqBody;
    const schema = Joi.object().keys({
      _id: Joi.string().allow('').required(),
      voteId: Joi.string().required(),
      name: Joi.string().required(),
      phone: Joi.string().allow('').required(),
      idno: Joi.string().allow('').required(),
      birth: Joi.string().allow('').regex(/^(\\)|(\d{4}\-\d{1,2}\-\d{1,2})$/),
      level: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    add(user.userId, { _id, voteId, name, phone, idno, birth, level });
    callback(setSuccess());
  },
  /**
   * @description 批量导入白名单
   * @param {*} reqBody { voteId, data: [{ name, phone, idno, birth }] }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   */
  addbatch: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId, data } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
      data: Joi.array().min(1).items(Joi.object().keys({
        name: Joi.string().required(),
        phone: Joi.string().allow('').required(),
        idno: Joi.string().allow('').required(),
        birth: Joi.string().allow('').regex(/^(\\)|(\d{4}\-\d{1,2}\-\d{1,2})$/),
        level: Joi.string().required(),
      })).required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      await add(user.userId, { voteId, ...item });
    }
    callback(setSuccess());
  },
  info: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { whid } = reqBody;
    const schema = Joi.object().keys({
      whid: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let data = await model.WhiteList.findById(whid);
    data = data.toObject();
    if (data.idno) data.idno = utils.hideID(data.idno);
    if (data.phone) data.phone = utils.hidePhone(data.phone);
    callback(setSuccess(data));
  },
};

async function add(userId, { _id, voteId, name, phone, idno, birth, level }) {
  let wid = '';
  let idNoInfo = utils.isCardID(idno);
  if (idNoInfo) {
    wid = idno;
    birth = idNoInfo.birth;
  } else if (utils.isPhone) {
    wid = phone;
  }
  if (level == '时点资产5万元以上') level = 'W5';
  if (level == '时点资产10万元以上') level = 'W10';
  if (_id) { //更新
    return await model.WhiteList.updateOne({ _id }, { $set: { name, birth, level } });
  }
  const existed = await model.WhiteList.findOne({ wid }, { state: 1 });
  if (existed) {
    if (existed.state == 1) {
      await model.WhiteList.updateOne({ _id: existed._id }, {
        $set: { name, birth, phone, idno, level, state: 0, createdBy: userId, }
      });
    } else {
      await model.WhiteList.updateOne({ _id: existed._id }, {
        $set: { name, birth, phone, idno, level, }
      });
    }
  } else {
    const whitelist = new model.WhiteList({
      _id: utils.uniqid(), voteId, wid, name, phone, idno, birth, level, state: 0, createdBy: userId, createdAt: utils.nowDate(), createtime: utils.nowTime()
    });
    await whitelist.save();
  }
}

async function list({ where, order, page, limit, fields }, ) {
  let query = model.WhiteList.find(where);
  if (fields) query = query.select(fields);
  if (page && limit) query = query.skip((page - 1) * limit).limit(limit);
  if (order) query = query.sort(order);
  const data = await query.exec();
  const count = await model.WhiteList.countDocuments(where);
  const loadmore = count > 0 && ((page - 1) * limit + data.length) < count;
  return utils.ResObj({ count, data: _.map(data, (n) => n.toObject()), loadmore });
}