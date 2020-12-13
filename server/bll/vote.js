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

module.exports = {
  add: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    let { voteId, voteinfo } = reqBody;
    let { title, tag, address, lotteryUrl, cover, posterbg, start, end, desc } = voteinfo;
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      tag: Joi.string().required(),
      address: Joi.string().required(),
      self_registration: Joi.boolean().required(),
      lotteryUrl: Joi.string().allow('').required(),
      cover: Joi.string().required(),
      posterbg: Joi.string().required(),
      start: Joi.number().required(),
      end: Joi.number().required(),
      desc: Joi.string().required(),
    });
    const res = Joi.validate(voteinfo, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    voteinfo.tagp = utils.getPinYin(voteinfo.tag);
    if (voteId) {
      let ovote = await model.Vote.findById(voteId);
      ovote = ovote.toObject();
      if (!ovote.shareshorturl) voteinfo.shareshorturl = process.env.ROOT_URL + "/#/active_detail/" + voteId;
      await model.Vote.updateOne({ _id: voteId }, { $set: voteinfo });
      //封面变更
      if (cover != ovote.cover) {
        //更新新封面
        await model.File.updateOne({ url: cover }, { $set: { voteId } });
        //删除旧封面
        await model.File.updateOne({ url: ovote.cover }, { $unset: { voteId: '' } });
      }
      //海报背景图变更
      if (posterbg != ovote.posterbg) {
        //更新新封面
        await model.File.updateOne({ url: posterbg }, { $set: { voteId } });
        //删除旧封面
        await model.File.updateOne({ url: ovote.posterbg }, { $unset: { voteId: '' } });
      }
    } else {
      voteId = utils.makeUUID();
      const vote = new model.Vote({
        _id: voteId, bindId: "",
        title, tag, address, lotteryUrl, cover, posterbg, shareshorturl: process.env.ROOT_URL + "/#/active_detail/" + voteId, start, end, desc, state: 0, self_registration: true,
        rule: config.defaultRule, formset: config.defaultForm, createdBy: user.userId, createdAt: utils.nowDate(), createtime: utils.nowTime()
      });
      await vote.save();
      //更新活动封面
      await model.File.updateOne({ url: cover }, { $set: { voteId } });
      //更新活动海报背景
      await model.File.updateOne({ url: posterbg }, { $set: { voteId } });
    }
    callback(setSuccess());
  },
  allforweb: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const where = { state: 0, bindId: '' };
    const order = { createdAt: -1 };
    const fields = { title: 1, formset: 1 };
    const data = await list({ where, order, fields });
    data.data.forEach(item => {
      item.formset = _.extend(_.extend({}, config.defaultForm), item.formset || {});
    });
    callback(setSuccess(data.data));
  },
  /**
   * @description 投票活动列表
   * @param {*} reqBody { page, limit }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   * @return {*} { count: '总数据量', data: '本次查询数据', loadmore: '是否有更多数据' }
   */
  list: async function (reqBody, user, callback) {
    const { page, limit, tags } = reqBody;
    const schema = Joi.object().keys({
      page: Joi.number().min(1).required(),
      limit: Joi.number().required(),
      tags: Joi.string().allow('').required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const where = { state: 0, publish: true, bindId: '' };
    if (tags) where.tagp = tags;
    const order = { createdAt: -1 };
    const fields = { title: 1, cover: 1, start: 1, end: 1, };
    const data = await list({ where, order, page, limit, fields });
    callback(setSuccess(data));
  },
  listforweb: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { page, limit } = reqBody;
    const schema = Joi.object().keys({
      page: Joi.number().min(1).required(),
      limit: Joi.number().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const where = { state: 0, bindId: '' };
    const order = { createdAt: -1 };
    const data = await list({ where, order, page, limit });
    let voteIds = _.pluck(data.data, "_id");
    const items = await model.Item.find({ voteId: { $in: voteIds }, state: 0 }).select({ voteId: 1, votecount: 1 }).exec();
    data.data.forEach(vote => {
      let voteitems = _.where(items, { voteId: vote._id });
      vote.itemcount = voteitems.length;
      vote.votecount = _.reduce(voteitems, (a, b) => a + b.votecount, 0);
      vote.h5url = process.env.ROOT_URL + "/#/active_detail/" + vote._id;
      vote.short_h5url = utils.makeShareUrl({ type: 'redirect', path: "/active_detail/" + vote._id });
      vote.h5listurl = process.env.ROOT_URL + "/#/list" + (vote.tagp ? ('/' + vote.tagp) : '');
      vote.short_h5listurl = utils.makeShareUrl({ type: 'redirect', path: "/list" + (vote.tagp ? ('/' + vote.tagp) : '') });
    });
    callback(setSuccess(data));
  },
  /**
   * @description 投票活动信息
   * @param {*} reqBody { voteId: '活动ID' }
   * @param {*} user { _id: '账号ID', role: '账号角色', userId: '用户ID', level: '用户级别', ip }
   * @return {*} 投票活动信息
   */
  info: async function (reqBody, user, callback) {
    let { voteId, itemId } = reqBody;
    itemId = itemId || "";
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
      itemId: Joi.string().allow('').required(),
    });
    const res = Joi.validate({ voteId, itemId }, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let vote = await model.Vote.findById(voteId);
    if (!vote || vote.state != 0) return callback(setError(ResCode.ERR_OBJECTNULL));
    vote = vote.toObject();
    vote.ruledesc = makeRuleDesc(vote.rule);
    vote.formset = _.extend(_.extend({}, config.defaultForm), vote.formset || {});
    if (itemId) {
      var leftvotecount = await getLeftVoteCount({ voteId, itemId, user });
      vote.leftvotecount = leftvotecount;
    }
    //Statistics
    if (user.from == 'mobile') await db.addStatistics({ type: "viewCount", voteId });
    if (user.userId && user.from == 'mobile') await db.addActiveUser({ userId: user.userId, voteId });
    callback(setSuccess(vote));
  },
  infoweb: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let vote = await model.Vote.findById(voteId);
    if (!vote || vote.state != 0) return callback(setError(ResCode.ERR_OBJECTNULL));
    vote = vote.toObject();
    callback(setSuccess(vote));
  },
  rulelist: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { page, limit } = reqBody;
    const schema = Joi.object().keys({
      page: Joi.number().min(1).required(),
      limit: Joi.number().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    const where = { state: 0, bindId: '' };
    const order = { createdAt: -1 };
    const data = await list({ where, order, page, limit });
    data.data.forEach(item => {
      if (!_.has(item.rule, 'default')) item.rule.default = 1;
    });
    callback(setSuccess(data));
  },
  ruleinfo: async function (reqBody, user, callback) {
    const { voteId } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let vote = await model.Vote.findById(voteId);
    if (!vote || vote.state != 0) return callback(setError(ResCode.ERR_OBJECTNULL));
    vote = vote.toObject();
    if (user.from == 'mobile') await db.addStatistics({ type: "viewCount", voteId });
    if (user.userId && user.from == 'mobile') await db.addActiveUser({ userId: user.userId, voteId });
    if (!_.has(vote.rule, 'default')) vote.rule.default = 1;
    callback(setSuccess(vote.rule || {}));
  },
  saverule: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId, rule } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
      rule: Joi.object().keys({
        count: Joi.number().min(1).max(5).required(),
        rate: Joi.string().regex(/^everyteam|everyday|everyteam\+everyday|total$/),
        default: Joi.number().min(0).max(5).required(),
        LV1: Joi.number().min(0).max(5).required(),
        LV2: Joi.number().min(0).max(5).required(),
        LV3: Joi.number().min(0).max(5).required(),
        LV4: Joi.number().min(0).max(5).required(),
        LV5: Joi.number().min(0).max(5).required(),
        W5: Joi.number().min(0).max(5).required(),
        W10: Joi.number().min(0).max(5).required(),
      })
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    await model.Vote.findByIdAndUpdate(voteId, { $set: { rule } });
    callback(setSuccess());
  },
  forminfo: async function (reqBody, user, callback) {
    const { voteId } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    let vote = await model.Vote.findById(voteId);
    if (!vote || vote.state != 0) return callback(setError(ResCode.ERR_OBJECTNULL));
    vote = vote.toObject();
    vote.formset = _.extend(_.extend({}, config.defaultForm), vote.formset || {});
    callback(setSuccess(vote.formset || {}));
  },
  saveform: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId, formset } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
      formset: Joi.object().keys({
        title: Joi.object().required(),
        linkman: Joi.object().required(),
        linkphone: Joi.object().required(),
        images: Joi.object().required(),
        videos: Joi.object().required(),
        slogan: Joi.object().required(),
        IDnumber: Joi.object().required(),
        comefrom: Joi.object().required(),
      })
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    if (!formset.title.show) return callback(setError(ResCode.ERR_FORM_TITLE_SHOW));
    if (!formset.title.required) return callback(setError(ResCode.ERR_FORM_TITLE_REQUIRED));
    await model.Vote.findByIdAndUpdate(voteId, { $set: { formset } });
    callback(setSuccess());
  },
  active: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    var vote = await model.Vote.findById(voteId, { publish: 1 });
    if (vote) {
      await model.Vote.updateOne({ _id: voteId }, { $set: { publish: !vote.publish } });
    }
    callback(setSuccess());
  },
  banners: [async function (reqBody, { ip }, callback) {
    const { tags } = reqBody;
    let where = { state: 0, publish: true, recommend: true, bindId: '' };
    if (tags) where.tagp = tags;
    const order = { createdAt: -1 };
    const fields = { title: 1, cover: 1 };
    let data = await list({ where, order, page: 1, limit: 3, fields });
    if (data.count == 0) {
      where = { state: 0, publish: true, bindId: '' };
      if (tags) where.tagp = tags;
      data = await list({ where, order, page: 1, limit: 3, fields });
    }
    callback(setSuccess(data.data));
  }],
  remove: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const { voteId } = reqBody;
    const schema = Joi.object().keys({
      voteId: Joi.string().required(),
    });
    const res = Joi.validate(reqBody, schema);
    if (res.error) return callback(setError(ResCode.ERR_FORMATE));
    await model.Vote.findByIdAndUpdate(voteId, { $set: { state: 1, removeBy: user.userId, removeTime: new Date() } });
    callback(setSuccess());
  },
};

async function list({ where, order, page, limit, fields }) {
  let query = model.Vote.find(where);
  if (fields) query = query.select(fields);
  if (page && limit) query = query.skip((page - 1) * limit).limit(limit);
  if (order) query = query.sort(order);
  const data = await query.exec();
  const count = await model.Vote.countDocuments(where);
  const loadmore = count > 0 && ((page - 1) * limit + data.length) < count;
  return utils.ResObj({ count, data: _.map(data, (n) => n.toObject()), loadmore });
}

async function getLeftVoteCount({ voteId, itemId, user }) {
  const items = await model.Item.find({ voteId, state: 0 }).select({ _id: 1 }).exec();
  const itemIds = _.pluck(items, "_id");
  const records = await model.Record.find({ voteId, userId: user.userId, itemId: { $in: itemIds }, }).select({ itemId: 1, voteYear: 1, voteMonth: 1, voteDay: 1 }).exec();
  const { year, month, day } = utils.nowDateObj();
  const vote = await model.Vote.findById(voteId, { rule: 1, gcwrule: 1 });
  var leftvotecount = 0, votedcount = 0;
  var rule = vote.gcwrule ? (user.customerType == '1' ? (vote.gcwrule[user.level] || vote.gcwrule[user.wlevel] || vote.gcwrule['default']) : vote.gcwrule['default']) : vote.rule;
  if (user.userId) {
    if (rule.rate == 'total') {
      votedcount = records.length;
      leftvotecount = rule.count - votedcount;
    } else if (rule.rate == 'everyday') {
      votedcount = _.where(records, { voteYear: year, voteMonth: month, voteDay: day }).length;
      leftvotecount = rule.count - votedcount;
    } else if (rule.rate == 'everyteam+everyday') {
      votedcount = _.where(records, { itemId, voteYear: year, voteMonth: month, voteDay: day }).length;
      if (rule.count - votedcount > 0) leftvotecount += (rule.count - votedcount);
    }
  }
  if (leftvotecount < 0) leftvotecount = 0
  return utils.ResObj(leftvotecount);
}

function makeRuleDesc(rule) {
  var result = [];
  switch (rule.rate) {
    case 'everyteam+everyday':
      result.push(`活动期内每天可给每个参赛队投票${rule.count}次`);
      break;
    case 'everyday':
      result.push(`活动期内每天可投票${rule.count}次`);
      break;
    case 'total':
      result.push(`活动期内可投票${rule.count}次`);
      break;
  }
  result.push(`非持卡用户每次投票可增加${rule.LV1}票`);
  result.push(`普卡用户每次投票可增加${rule.LV1}票`);
  result.push(`金卡用户每次投票可增加${rule.LV2}票`);
  result.push(`金葵花用户每次投票可增加${rule.LV3}票`);
  result.push(`钻石卡用户每次投票可增加${rule.LV4}票`);
  result.push(`私人银行用户每次投票可增加${rule.LV5}票`);
  return result.map((n, i) => {
    return `${i + 1}. ${n}`;
  }).join('<br />');
}