const db = require('../db');
const model = require('../model');
const _ = require('underscore');
const utils = require('../utils');
const ResultInfo = require('../ResultInfo');
const setSuccess = ResultInfo.setSuccess;
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;
const Joi = require('@hapi/joi');
const config = require('../config');
const check = require('../check');

module.exports = {
  /**
   * @description 报名参加投票活动
   * @param {*} reqBody { voteId, title, linkman, linkphone, images, videos, slogan }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   */
  add: function (reqBody, user, callback) {
    add(reqBody, user, callback, 'app');
  },
  addweb: function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    add(reqBody, user, callback, 'web');
  },
  /**
   * @description 投票项目列表
   * @param {*} reqBody { voteId, page, limit }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   * @return {*} { count: '总数据量', data: '本次查询数据', loadmore: '是否有更多数据' }
   */
  listforweb: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId, page, limit } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().allow('').required(),
      page: Joi.number().min(1).required(),
      limit: Joi.number().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const where = { state: { $in: [-1, 0, 1] } };
    if (voteId) where.voteId = voteId;
    const order = { createdAt: -1 };
    const data = await list({ where, order, page, limit });
    var voteIds = _.uniq(_.pluck(data.data, "voteId"));
    const votes = await model.Vote.find({ _id: { $in: voteIds } }).select({ title: 1, cover: 1 }).exec();
    data.data.forEach(item => {
      item.vote = _.findWhere(votes, { _id: item.voteId });
      if (!item.cover) item.cover = item.vote.cover;
    });
    callback(setSuccess(data));
  },
  /**
   * @description 按得票数排名
   * @param {*} reqBody
   * @param {*} user
   * @param {*} callback
   */
  listbyvotecount: async function (reqBody, user, callback) {
    const { voteId, page, limit, refresh } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(), page: Joi.number(), limit: Joi.number(), refresh: Joi.boolean(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const where = { voteId, state: 0 };
    const order = { votecount: -1, createdAt: 1 };
    const fields = { IDnumber: 0, linkman: 0, linkphone: 0, };
    const data = await list({ where, order, page, limit, fields, refresh });
    if (data.data.length > 0) {
      const items = [];
      const itemIds = _.pluck(data.data, "_id");
      const records = await model.Record.find({ voteId, userId: user.userId, itemId: { $in: itemIds }, }).select({ itemId: 1, voteYear: 1, voteMonth: 1, voteDay: 1 }).exec();
      const { year, month, day } = utils.nowDateObj();
      const vote = await model.Vote.findById(voteId, { rule: 1, gcwrule: 1, cover: 1 });
      var rule = vote.gcwrule ? (user.customerType == '1' ? (vote.gcwrule[user.level] || vote.gcwrule[user.wlevel] || vote.gcwrule['default']) : vote.gcwrule['default']) : vote.rule;
      for (let i = 0; i < data.data.length; i++) {
        let item = data.data[i];
        let voted = false, voteable = false, votetimes = 0, recordcount = 0;
        if (user.userId) {
          if (rule.rate == 'total') {
            recordcount = records.length;
          } else if (rule.rate == 'everyday') {
            recordcount = _.where(records, { voteYear: year, voteMonth: month, voteDay: day }).length;
          } else if (rule.rate == 'everyteam+everyday') {
            recordcount = _.where(records, { itemId: item._id, voteYear: year, voteMonth: month, voteDay: day }).length;
          }
          if (vote.gcwrule) {
            if (rule.times > votetimes) votetimes = rule.times;
            voted = (rule.count > 0 && recordcount >= rule.count);
            voteable = (rule.count > 0 && recordcount < rule.count);
          } else {
            if (rule[user.level] > votetimes) votetimes = rule[user.level];
            if (rule[user.wlevel] > votetimes) votetimes = rule[user.wlevel];
            voted = (votetimes > 0 && recordcount >= rule.count);
            voteable = (votetimes > 0 && recordcount < rule.count);
          }
        }
        if (!item.cover) item.cover = vote.cover;
        items.push({ ...item, voted, voteable, });
      }
      data.data = items;
    }
    //Statistics
    if (user.from == 'mobile') await db.addStatistics({ type: "viewCount", voteId });
    if (user.userId && user.from == 'mobile') await db.addActiveUser({ userId: user.userId, voteId });
    callback(setSuccess(data));
  },
  /**
   * @description 投票项目信息
   * @param {*} reqBody { itemId: '项目ID' }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   * @return {*} 投票信息
   */
  info: async function (reqBody, user, callback) {
    const { itemId } = reqBody;
    const schema = Joi.object().keys({ itemId: Joi.string().required() });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let item = await model.Item.findById(itemId, { IDnumber: 0, linkman: 0, linkphone: 0, });
    if (!item || item.state != 0) return callback(setError(ResCode.ERR_OBJECTNULL));
    item = item.toObject();
    const vote = await model.Vote.findById(item.voteId, { start: 1, end: 1, rule: 1, gcwrule: 1, title: 1, cover: 1, posterbg: 1, shareshorturl: 1, formset: 1, });
    item.vote = vote.toObject();
    if (!item.cover) item.cover = vote.cover;
    item.voted = false;
    item.voteable = false;
    if (user.userId) {
      const { year, month, day } = utils.nowDateObj();
      const { voteable, voted } = await check.checkVote({ voteId: item.voteId, itemId, ..._.pick(user, ['userId', 'level', 'wlevel']), ..._.pick(vote, ['rule', 'gcwrule']), year, month, day });
      item.voted = voted;
      item.voteable = voteable;
    }
    item.qrCodeUrl = process.env.ROOT_URL + "/#/partner_detail/" + itemId;
    item.cmbUrl = utils.makeShareUrl({ shareshorturl: vote.shareshorturl || item.qrCodeUrl, type: "redirect", path: "/partner_detail/" + itemId });
    //Statistics
    if (user.from == 'mobile') await db.addStatistics({ type: "viewCount", voteId: item.voteId });
    if (user.userId && user.from == 'mobile') await db.addActiveUser({ userId: user.userId, voteId: item.voteId });
    item.forms = makeExtraShowForms(item.vote, item);
    callback(setSuccess(item));
  },
  infoweb: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { itemId } = reqBody;
    const schema = Joi.object().keys({ itemId: Joi.string().required() });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let item = await model.Item.findById(itemId);
    if (!item) return callback(setError(ResCode.ERR_OBJECTNULL));
    item = item.toObject();
    const vote = await model.Vote.findById(item.voteId, { start: 1, end: 1, rule: 1, title: 1, cover: 1, posterbg: 1, });
    item.vote = vote.toObject();
    if (!item.cover) item.cover = vote.cover;
    item.voteable = false;
    item.voted = false;
    callback(setSuccess(item));
  },
  /**
   * @description 我的报名
   * @param {*} user
   */
  my: async function (reqBody, user, callback) {
    if (!user.userId || !user.uid) return callback(setSuccess([]));
    const where = { $or: [{ userId: user.userId }, { uids: user.uid }], state: { $ne: 2 } };
    const order = { createdAt: -1 };
    const data = await list({ where, order });
    if (data.data.length > 0) {
      const voteIds = _.uniq(_.pluck(data.data, "voteId"));
      const votes = await model.Vote.find({ _id: { $in: voteIds } }).select({ start: 1, end: 1, cover: 1, }).exec();
      data.data.forEach(item => {
        var vote = _.findWhere(votes, { _id: item.voteId });
        _.extend(item, _.pick(vote, ['start', 'end']));
        if (!item.cover) item.cover = vote.cover;
      });
    }
    callback(setSuccess(data.data));
  },
  /**
   * @description 我的投票
   * @param {*} user
   */
  voted: async function (reqBody, user, callback) {
    const { page, limit, refresh } = reqBody;
    const schema = Joi.object().keys({
      page: Joi.number().required(),
      limit: Joi.number().required(),
      refresh: Joi.boolean().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let records = await model.Record.find({ userId: user.userId }).select({ itemId: 1 }).exec();
    let itemIds = _.uniq(_.pluck(records, 'itemId'));
    const where = { _id: { $in: itemIds }, state: 0 };
    const order = { votecount: -1 };
    const fields = { IDnumber: 0, linkman: 0, linkphone: 0, };
    const data = await list({ where, order, page, limit, fields, refresh, });
    if (data.data.length > 0) {
      const items = [];
      itemIds = _.pluck(data.data, "_id");
      records = await model.Record.find({ userId: user.userId, itemId: { $in: itemIds }, }).select({ voteId: 1, itemId: 1, voteYear: 1, voteMonth: 1, voteDay: 1 }).exec();
      const voteIds = _.uniq(_.pluck(records, "voteId"));
      const { year, month, day } = utils.nowDateObj();
      const votes = await model.Vote.find({ _id: { $in: voteIds } }).select({ rule: 1, gcwrule: 1, cover: 1, }).exec();
      for (let i = 0; i < data.data.length; i++) {
        let item = data.data[i];
        let vote = _.findWhere(votes, { _id: item.voteId });
        var rule = vote.gcwrule ? (user.customerType == '1' ? (vote.gcwrule[user.level] || vote.gcwrule[user.wlevel] || vote.gcwrule['default']) : vote.gcwrule['default']) : vote.rule;
        let voted = false, voteable = false, votetimes = 0, recordcount = 0;
        if (rule.rate == 'total') {
          recordcount = _.where(records, { voteId: item.voteId }).length;
        } else if (rule.rate == 'everyday') {
          recordcount = _.where(records, { voteId: item.voteId, voteYear: year, voteMonth: month, voteDay: day }).length;
        } else if (rule.rate == 'everyteam+everyday') {
          recordcount = _.where(records, { voteId: item.voteId, itemId: item._id, voteYear: year, voteMonth: month, voteDay: day });
        }
        if (vote.gcwrule) {
          if (rule.times > votetimes) votetimes = rule.times;
          voted = (rule.count > 0 && recordcount >= rule.count);
          voteable = (rule.count > 0 && recordcount < rule.count);
        } else {
          if (rule[user.level] > votetimes) votetimes = rule[user.level];
          if (rule[user.wlevel] > votetimes) votetimes = rule[user.wlevel];
          voted = (votetimes > 0 && recordcount >= rule.count);
          voteable = (votetimes > 0 && recordcount < rule.count);
        }
        if (!item.cover) item.cover = vote.cover;
        items.push({ ...item, voted, voteable, });
      }
      data.data = items;
    }
    callback(setSuccess(data));
  },
  pass: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { itemId } = reqBody;
    const schema = Joi.object().keys({
      itemId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    await model.Item.findByIdAndUpdate(itemId, { $set: { state: 0, passBy: user.userId, passTime: new Date() } });
    callback(setSuccess());
  },
  reject: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { itemId } = reqBody;
    const schema = Joi.object().keys({
      itemId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    await model.Item.findByIdAndUpdate(itemId, { $set: { state: 1, rejectBy: user.userId, rejectTime: new Date() } });
    callback(setSuccess());
  },
  remove: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { itemId } = reqBody;
    const schema = Joi.object().keys({
      itemId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    await model.Item.findByIdAndUpdate(itemId, { $set: { state: 2, removeBy: user.userId, removeTime: new Date() } });
    callback(setSuccess());
  },
};

async function list({ where, order, page, limit, fields, refresh }) {
  let query = model.Item.find(where);
  if (fields) query = query.select(fields);
  if (page && limit) {
    if (refresh) {
      query = query.skip(0).limit(page * limit);
    } else {
      query = query.skip((page - 1) * limit).limit(limit);
    }
  }
  if (order) query = query.sort(order);
  const data = await query.exec();
  const count = await model.Item.countDocuments(where);
  const loadmore = count > 0 && ((page - 1) * limit + data.length) < count;
  return utils.ResObj({ count, data: _.map(data, (n) => n.toObject()), loadmore });
}
async function add(reqBody, user, callback, from) {
  if (!reqBody.linkman) reqBody.linkman = '';
  if (!reqBody.linkphone) reqBody.linkphone = '';
  if (!reqBody.images) reqBody.images = [];
  reqBody.cover = reqBody.images[0] || '';
  if (!reqBody.videos) reqBody.videos = [];
  if (!reqBody.slogan) reqBody.slogan = '';
  if (!reqBody.IDnumber) reqBody.IDnumber = '';
  if (!reqBody.comefrom) reqBody.comefrom = '';
  const { _id, voteId, title, linkman, linkphone, cover, images, videos, slogan, IDnumber, comefrom } = reqBody;
  var vote = await model.Vote.findById(voteId);
  if (vote.formset.title && vote.formset.title.show && vote.formset.title.required && !title) return callback({ code: 4, msg: vote.formset.title.title + "不能为空" });
  if (vote.formset.linkman && vote.formset.linkman.show && vote.formset.linkman.required && !linkman) return callback({ code: 4, msg: vote.formset.linkman.title + "不能为空" });
  if (vote.formset.linkphone && vote.formset.linkphone.show && vote.formset.linkphone.required) {
    if (!linkphone) return callback({ code: 4, msg: vote.formset.linkphone.title + "不能为空" });
    if (!utils.isPhone(linkphone)) return callback({ code: 4, msg: vote.formset.linkphone.title + "不正确,请检查" });
  }
  if (vote.formset.images && vote.formset.images.show && vote.formset.images.required && images.length == 0) return callback({ code: 4, msg: vote.formset.images.title + "不能为空" });
  if (vote.formset.videos && vote.formset.videos.show && vote.formset.videos.required && videos.length == 0) return callback({ code: 4, msg: vote.formset.videos.title + "不能为空" });
  if (vote.formset.slogan && vote.formset.slogan.show && vote.formset.slogan.required && !slogan) return callback({ code: 4, msg: vote.formset.slogan.title + "不能为空" });
  if (vote.formset.IDnumber && vote.formset.IDnumber.show && vote.formset.IDnumber.required) {
    if (!IDnumber) return callback({ code: 4, msg: vote.formset.IDnumber.title + "不能为空" });
    if (!utils.isCardID(IDnumber)) return callback({ code: 4, msg: vote.formset.IDnumber.title + "不正确,请检查" });
  }
  if (vote.formset.comefrom && vote.formset.comefrom.show && vote.formset.comefrom.required && !comefrom) return callback({ code: 4, msg: vote.formset.comefrom.title + "不能为空" });
  let existed = await model.Item.findOne({ voteId, _id: { $ne: _id }, title, state: { $in: [-1, 0] } });
  if (existed) return callback(setError(ResCode.ERR_DUPLICATE_ITEM_TITLE));
  if (from == 'app') {
    if (!user.userId) return callback(setError(ResCode.ERR_DUPLICATE_ITEM));
    existed = await model.Item.findOne({ voteId, userId: user.userId, state: { $in: [-1, 0] } });
    if (existed) return callback(setError(ResCode.ERR_DUPLICATE_ITEM));
  }
  if (from == 'app' && !vote.self_registration) return callback(setError(ResCode.ERR_VOTE_SELF_REGISTRATION));
  if (_id) {
    var olditem = await model.Item.findById(_id);
    await model.Item.updateOne({ _id }, { $set: { title, linkman, linkphone, cover, images, videos, slogan } });
    for (let i = 0; i < olditem.images.length; i++) {
      let image = olditem.images[i];
      if (images.indexOf(image) == -1) await model.File.updateOne({ url: image }, { $unset: { itemId: '' } });
    }
    for (let i = 0; i < olditem.videos.length; i++) {
      let video = olditem.videos[i];
      if (videos.indexOf(video) == -1) await model.File.updateOne({ url: video }, { $unset: { itemId: '' } });
    }
    for (let i = 0; i < images.length; i++) {
      let image = images[i];
      if (olditem.images.indexOf(image) == -1) await model.File.updateOne({ url: image }, { $set: { itemId: _id } });
    }
    for (let i = 0; i < videos.length; i++) {
      let video = videos[i];
      if (olditem.videos.indexOf(video) == -1) await model.File.updateOne({ url: video }, { $set: { itemId: _id } });
    }
  } else {
    const item = new model.Item({
      _id: utils.uniqid(), voteId, userId: from == 'app' ? user.userId : '', title, linkman, linkphone, IDnumber, cover, images, videos, slogan, votecount: 0, sharecount: 0, viewcount: 0,
      state: from == 'web' ? 0 : -1, createdBy: user.userId, from, createdAt: utils.nowDate(), createtime: utils.nowTime()
    });
    const itemId = (await item.save())._id;
    for (let i = 0; i < images.length; i++) {
      let image = images[i];
      //更新队伍精彩图片
      await model.File.updateOne({ url: image }, { $set: { itemId } });
    }
    for (let i = 0; i < videos.length; i++) {
      let video = videos[i];
      //更新队伍精彩视频
      await model.File.updateOne({ url: video }, { $set: { itemId } });
    }
  }
  callback(setSuccess());
}

function makeExtraShowForms(vote, item) {
  var forms = [];
  for (var i = 0; i < config.extraShowForms.length; i++) {
    var form = config.extraShowForms[i];
    var formset = vote.formset[form];
    if (formset && formset.extrashow) {
      forms.push({ name: formset.extrashowname, value: item[form] || '' });
    }
  }
  return forms;
}