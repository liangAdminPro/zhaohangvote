const _ = require('underscore');
const utils = require('./utils');
const mongoose = require('mongoose');
const cache = require('memory-cache');
const config = require('./config');
const ResultInfo = require('./ResultInfo');
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;
const model = require('./model');
if (!process.env.MONGO_URL) {
  console.log('please set `MONGO_URL` environment before start the application.');
  process.exit(1);
}
// mongodb 连接🔗
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  autoReconnect: true,
  poolSize: 10,
  reconnectTries: 30,
  reconnectInterval: 500,
  bufferCommands: false,
  autoIndex: process.env.NODE_ENV == 'production' ? false : true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error'));
db.once('open', function () {
  console.log('Mongodb started successfully');
  initData();
  require('./cron');
});
//添加系统用户
async function addUser(options) {
  let { uid, mobile, uniqueUserId, expandUserId, newUserId, level, customerType, idno, name, sex, XdParams, OriginalXdParams } = options;
  let created = false, updated = false;
  if (utils.isCardID(uid)) {
    let idNoInfo = utils.isCardID(uid);
    sex = idNoInfo.sex;
    idno = uid;
  } else if (utils.isPhone(uid)) mobile = uid;
  // else if (expandUserId) uid = expandUserId;//TODO
  else return utils.ResObj(setError(ResCode.ERR_ACCOUNT_INVALID));
  const user = new model.User({
    _id: utils.uniqid(), uid, mobile, uniqueUserId, expandUserId, newUserId, level, customerType, idno, name, sex, state: 0, XdParams, OriginalXdParams, createdAt: utils.nowDate(), createtime: utils.nowTime()
  });
  let _user = await model.User.findOne({ uid });
  // if (!_user && expandUserId) _user = await model.User.findOne({ uid: expandUserId });//TODO
  if (!_user) {
    _user = await user.save();
    created = true;
  } else {
    const doc = { ..._.pick(user.toObject(), ['mobile', 'uniqueUserId', 'expandUserId', 'newUserId', 'level', 'customerType', 'idno', 'name', 'sex', 'state', 'XdParams', 'OriginalXdParams']) };
    // if (expandUserId) _.extend(doc, { uid: expandUserId });//TODO
    await model.User.findByIdAndUpdate(_user._id, { $set: doc });
    updated = true;
  }
  return utils.ResObj({ code: 0, data: _user._id, created, updated });
}
//添加账户
async function addAdmin({ mobile, name, role, corpname }) {
  const result = await addUser({ uid: mobile, mobile, name, });
  if (result.code == 0) {
    const userId = result.data;
    const password = mobile.substr(5);
    const salt = utils.makeUUID();
    const admin = new model.Admin({
      _id: utils.uniqid(), userId, mobile, username: mobile, password: utils.getPwd(password, salt), salt, name, corpname, initpwd: password, state: 0, role, createdAt: utils.nowDate(), createtime: utils.nowTime()
    });
    let _admin = await model.Admin.findOne({ userId });
    if (!_admin) _admin = await admin.save();
    else {
      if (_admin.state == 1) {
        await model.Admin.findByIdAndUpdate(_admin._id, { $set: _.pick(admin.toObject(), ['password', 'salt', 'name', 'state', 'role']) });
      } else {
        return utils.ResObj({ code: 1, msg: '手机号已存在，不能重复添加' });
      }
    }
    return utils.ResObj({ code: 0 });
  }
  return utils.ResObj(result);
}
async function initAdmin() {
  const result = await addAdmin(config.defaultAdmin);
  console.log('addAdmin', result);
  return utils.ResObj(result);
}
async function initData() {
  await initAdmin();
}
async function addStatistics({ type, count, voteId }, today) {
  today = today || utils.nowDateObj();
  const { year, month, day } = today;
  const where = { year, month, day, voteId: "" };
  const where2 = { year, month, day, voteId };
  let doc = null, doc2 = null;
  count = count || 1;
  switch (type) {
    case "newUserCount"://新用户
      doc = { $inc: { newUserCount: count } };
      break;
    case "viewCount"://访问量
      doc = { $inc: { viewCount: count } };
      if (voteId) doc2 = { $inc: { viewCount: count } };
      break;
    case "voteCount"://投票数
      doc = { $inc: { voteCount: count } };
      if (voteId) doc2 = { $inc: { voteCount: count } };
      break;
    case "voteRecordCount"://投票记录数
      if (voteId) doc2 = { $inc: { voteRecordCount: count } };
      else doc = { $inc: { voteRecordCount: count } };
      break;
    case "voteUserCount"://投票人数
      //每十分钟更新一次
      if (voteId) doc2 = { $set: { voteUserCount: count } };
      else doc = { $set: { voteUserCount: count } };
      break;
    case "activeCount"://活跃数
      if (voteId) doc2 = { $inc: { activeCount: count } };
      else doc = { $inc: { activeCount: count } };
      break;
    case "activeUserCount"://活跃人数
      //每十分钟更新一次
      if (voteId) doc2 = { $set: { activeUserCount: count } };
      else doc = { $set: { activeUserCount: count } };
      break;
  }
  if (doc) await model.Statistics.updateOne(where, doc);
  if (doc2) await model.Statistics.updateOne(where2, doc2);
  return utils.ResObj({});
}
async function addActiveUser({ userId, voteId }) {
  const { year, month, day } = utils.nowDateObj();
  const activeUser = new model.ActiveUsers({
    _id: utils.uniqid(), voteId: voteId || "", userId, year, month, day, createdAt: utils.nowDate(), createtime: utils.nowTime(),
  });
  await activeUser.save();
  return utils.ResObj({});
}
function makeTransdataObj(obj) {
  if (!_.isObject(obj)) return {};
  let result = {};
  _.keys(obj).forEach(k => {
    let data = obj[k];
    if (k.indexOf('.') > -1) k = k.replace(/\./g, '_');
    result[k] = data;
  });
  return result;
}
async function saveLog({ from, modal, method, userId, headers, cookies, params, query, body, result }) {
  try {
    const transdata = new model.Transdata({
      _id: utils.uniqid(), from, modal, method, userId: userId || "",
      headers: makeTransdataObj(headers),
      cookies: makeTransdataObj(cookies),
      params: makeTransdataObj(params),
      query: makeTransdataObj(query),
      body: makeTransdataObj(body),
      result: makeTransdataObj(result),
      createtime: utils.nowTime()
    });
    await transdata.save();
  } catch (e) {
    console.error(e);
  }
}
module.exports = { cache, addUser, addAdmin, addStatistics, addActiveUser, saveLog };