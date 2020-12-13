const model = require('../model');
const _ = require('underscore');
const utils = require('../utils');
const ResultInfo = require('../ResultInfo');
const setSuccess = ResultInfo.setSuccess;
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;

module.exports = {
  data: async function (reqBody, user, callback) {
    if (!user._id) return callback(setError(ResCode.ERR_NOPOWER));
    const data = await getData();
    callback(setSuccess(data));
  },
};

async function getData(callback) {
  console.time('getData');
  const { year, month, day } = utils.nowDateObj();
  const statistics = await model.Statistics.find({ year, voteId: "" }).select({ month: 1, day: 1, activeUserCount: 1, _id: 0 }).exec();
  // statistics = _.map(statistics, s => _.extend({}, s.toObject()));
  const activeCount_year = _.reduce(statistics, (a, b) => a + b.activeUserCount, 0);
  const activeCount_month = _.reduce(_.where(statistics, { month }), (a, b) => a + b.activeUserCount, 0);
  const activeCount_day = _.reduce(_.where(statistics, { month, day }), (a, b) => a + b.activeUserCount, 0);
  let votes = await model.Vote.find({ state: 0, publish: true, bindId: '' }).select({ title: 1, start: 1, end: 1, createdAt: 1 }).exec();
  votes = _.map(votes, n => {
    var nv = _.extend({}, n.toObject());
    nv._state = getState(nv);
    return nv;
  });
  votes.sort(sortState);
  var votedata = [];
  for (let i = 0; i < votes.length; i++) {
    votedata.push(_.extend({}, votes[i]));
    if (votedata.length >= 4 || i == votes.length - 1) break;
  }
  var voteIds = _.pluck(votedata, "_id");
  const statistics_vote = await model.Statistics.find({ voteId: { $in: voteIds } }).select({ voteId: 1, voteCount: 1, viewCount: 1, _id: 0 }).exec();
  var votestatistics = {};
  statistics_vote.forEach(sv => {
    if (!votestatistics[sv.voteId]) votestatistics[sv.voteId] = { voteCount: 0, viewCount: 0, };
    votestatistics[sv.voteId].voteCount += sv.voteCount;
    votestatistics[sv.voteId].viewCount += sv.viewCount;
  });
  var weekObj = utils.nowWeekObj();
  var weeks = _.map(weekObj, w => {
    var wo = utils.nowDateObj(new Date(w[0]));
    return `${wo.year}-${wo.month}-${wo.day}`;
  });
  var statistics_week = await model.Statistics.find({ Date: { $in: weeks } }).select({ Date: 1, newUserCount: 1, viewCount: 1, voteCount: 1, _id: 0 }).exec();
  var weekstatistics = {
    newUserCount: [0, 0, 0, 0, 0, 0, 0],
    VoteCount: [0, 0, 0, 0, 0, 0, 0],
    viewCount: [0, 0, 0, 0, 0, 0, 0],
    voteCount: [0, 0, 0, 0, 0, 0, 0]
  }, todaydata = { newUserCount: 0, VoteCount: 0, viewCount: 0, voteCount: 0 };
  for (let i = 0; i < weeks.length; i++) {
    var week = weeks[i];
    var sweek = _.findWhere(statistics_week, { Date: week });
    var wobj = weekObj[i];
    weekstatistics.VoteCount[i] = await model.Vote.countDocuments({ state: 0, $or: [{ $and: [{ start: { $gte: wobj[0] } }, { start: { $lt: wobj[1] } }] }, { $and: [{ end: { $gte: wobj[0] } }, { start: { $lt: wobj[1] } }] }] });
    if (sweek) {
      weekstatistics.newUserCount[i] = sweek.newUserCount;
      weekstatistics.viewCount[i] = sweek.viewCount;
      weekstatistics.voteCount[i] = sweek.voteCount;
    }
    if (week == `${year}-${month}-${day}`) {
      todaydata.newUserCount = weekstatistics.newUserCount[i];
      todaydata.VoteCount = weekstatistics.VoteCount[i];
      todaydata.viewCount = weekstatistics.viewCount[i];
      todaydata.voteCount = weekstatistics.voteCount[i];
    }
  }
  console.timeEnd('getData');
  return utils.ResObj({ activeCount_day, activeCount_month, activeCount_year, votedata, votestatistics, weekstatistics, todaydata });
}
getData();
function getState(options) {
  if (options.start > Date.now()) {
    return 0//即将开始
  } else if (options.start < Date.now() && options.end > Date.now()) {
    return 1//正在进行
  } else if (options.end < Date.now()) {
    return 2//已经结束
  }
  return -1
}
//首页活动排序
function sortState(a, b) {
  var astate = tranState(a._state);
  var bstate = tranState(b._state);
  if (astate != bstate) return astate - bstate;
  if (astate == 0) return b.start - a.start;
  if (astate == 1) return a.start - b.start;
  if (astate == 2) return a.end - b.end;
  return b.createdAt - a.createdAt;
}
function tranState(state) {
  switch (state) {
    case 1: return 0;//正在进行
    case 0: return 1;//即将报名
    case 2: return 2;//已经结束
    default: return 3;//其他
  }
}