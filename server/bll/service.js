const _ = require('underscore');
const model = require('../model');
const utils = require('../utils');
const config = require('../config');
const ResultInfo = require('../ResultInfo');
const setSuccess = ResultInfo.setSuccess;
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;
const doStatistics = require('../statictics');

module.exports = {
  get: [async function (reqBody, { ip }, callback) {
    try {
      var result = JSON.parse(utils.AesDecode(reqBody.data, config.key));
      const { db, where, order, limit, page, fields } = result.data;
      const data = await list({ db, where, order, page, limit, fields });
      callback(setSuccess(data));
    } catch (e) {
      callback(setError(ResCode.ERR_INTERNAL));
    }
  }],
  set: [async function (reqBody, { ip }, callback) {
    try {
      var result = JSON.parse(utils.AesDecode(reqBody.data, config.key));
      const { db, action, where, data, ucount } = result.data;
      if (action == 'insert') {
        data._id = utils.uniqid();
        data.createdAt = utils.nowDate();
        let doc = new model[db](data);
        await doc.save();
      } else {
        let doc = {};
        doc[action] = data;
        if (ucount == 'one') await model[db].updateOne(where, doc);
        if (ucount == 'many') await model[db].updateMany(where, doc);
      }
      callback(setSuccess());
    } catch (e) {
      callback(setError(ResCode.ERR_INTERNAL));
    }
  }],
  count: [async function (reqBody, { ip }, callback) {
    try {
      var result = JSON.parse(utils.AesDecode(reqBody.data, config.key));
      const { db, where } = result.data;
      const data = await model[db].countDocuments(where);
      callback(setSuccess(data));
    } catch (e) {
      callback(setError(ResCode.ERR_INTERNAL));
    }
  }],
  statistics: [async function (reqBody, { ip }, callback) {
    try {
      var result = JSON.parse(utils.AesDecode(reqBody.data, config.key));
      const { today } = result.data;
      await doStatistics(today);
      callback(setSuccess());
    } catch (e) {
      callback(setError(ResCode.ERR_INTERNAL));
    }
  }],
};

async function list({ db, where, order, page, limit, fields }) {
  let query = model[db].find(where);
  if (fields) query = query.select(fields);
  if (page && limit) query = query.skip((page - 1) * limit).limit(limit);
  if (order) query = query.sort(order);
  const data = await query.exec();
  const count = await model[db].countDocuments(where);
  const loadmore = count > 0 && ((page - 1) * limit + data.length) < count;
  return utils.ResObj({ count, data: _.map(data, (n) => n.toObject()), loadmore });
}