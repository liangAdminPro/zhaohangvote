const CronJob = require('cron').CronJob;
const model = require('./model');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const _ = require('underscore');
const config = require('./config');
const utils = require('./utils');
const doStatistics = require('./statictics');
moment.locale('zh-cn');

var job0 = new CronJob('0 0 3 * * *', function () {
  try {
    console.log('清理日志')
    clearLog();
  } catch (e) {
    console.error(e);
  }
}, null, true, 'Asia/Shanghai', job0, false);

async function clearLog() {
  var dtime = moment().subtract(config.log_expire_days, 'days').toDate().getTime();
  const result = await model.Transdata.deleteMany({ createtime: { $lt: dtime } });
  console.log('本次清理日志：' + result.deletedCount);
}
var job1 = new CronJob('0 0 3 * * *', function () {
  try {
    console.log('清理无关联图片视频')
    clearFile();
  } catch (e) {
    console.error(e);
  }
}, null, true, 'Asia/Shanghai', job1, false);
async function clearFile() {
  var dtime = moment().subtract(config.file_expire_days, 'days').toDate();
  const files = await model.File.find({ $and: [{ voteId: null }, { itemId: null }, { state: 0 }], createdAt: { $lt: dtime } }).select({ path: 1 }).exec();
  console.log('本次需要删除文件：' + files.length);
  files.forEach(async file => {
    try {
      fs.unlinkSync(file.path);
      console.log('[', moment().format('YYYY-MM-DD HH:mm:ss'), ']删除' + file.path);
      await model.File.updateOne({ _id: file._id }, { $set: { state: 1 } });
    } catch (e) { }
  });
}
var job2 = new CronJob('0 0 3 * * *', function () {
  try {
    console.log('清理临时文件碎片')
    clearTempFile();
  } catch (e) {
    console.error(e);
  }
}, null, true, 'Asia/Shanghai', job2, false);
async function clearTempFile() {
  var dtime = moment().subtract(config.tmpfile_expire_days, 'days').toDate();
  const files = await model.FileTemp.find({ createdAt: { $lt: dtime } }).select({ filelist: 1 }).exec();
  console.log('本次需要删除文件：' + files.length);
  files.forEach(async file => {
    try {
      if (file.filelist && file.filelist.length > 0) {
        file.filelist.forEach(({ destination, filename }) => {
          let src = path.join(destination, filename);
          fs.unlinkSync(src);
          console.log('[', moment().format('YYYY-MM-DD HH:mm:ss'), ']删除' + src);
        });
      }
      await model.File.deleteOne({ _id: file._id });
    } catch (e) { }
  });
}
var job3 = new CronJob('0 0 * * * *', function () {
  try {
    console.log('初始化统计数据')
    initStatistics();
  } catch (e) {
    console.error(e);
  }
}, null, true, 'Asia/Shanghai', job3, true);
async function initStatistics() {
  const today = utils.nowDateObj();
  const tomorrow = utils.nowDateObj(moment().add(1, 'days').toDate());
  let ts = await model.Statistics.findOne({ voteId: "", ..._.pick(today, ['year', 'month', 'day']), });
  if (!ts) {
    let doc = {
      _id: utils.uniqid(), voteId: "",
      ..._.pick(today, ['year', 'month', 'day']),
      newUserCount: makeRandomNumber(),
      viewCount: makeRandomNumber(),
      voteCount: makeRandomNumber(),
      voteRecordCount: makeRandomNumber(),
      voteUserCount: makeRandomNumber(),
      activeCount: makeRandomNumber(),
      activeUserCount: makeRandomNumber(),
      createdAt: utils.nowDate(), createtime: utils.nowTime(),
      updatedAt: utils.nowDate(), updatetime: utils.nowTime(),
    };
    doc.Date = `${doc.year}-${doc.month}-${doc.day}`;
    ts = new model.Statistics(doc);
    await ts.save();
  }
  ts = await model.Statistics.findOne({ voteId: "", ..._.pick(tomorrow, ['year', 'month', 'day']), });
  if (!ts) {
    let doc = {
      _id: utils.uniqid(), voteId: "",
      ..._.pick(tomorrow, ['year', 'month', 'day']),
      newUserCount: makeRandomNumber2(),
      viewCount: makeRandomNumber2(),
      voteCount: makeRandomNumber2(),
      voteRecordCount: makeRandomNumber2(),
      voteUserCount: makeRandomNumber2(),
      activeCount: makeRandomNumber2(),
      activeUserCount: makeRandomNumber2(),
      createdAt: utils.nowDate(), createtime: utils.nowTime(),
      updatedAt: utils.nowDate(), updatetime: utils.nowTime(),
    };
    doc.Date = `${doc.year}-${doc.month}-${doc.day}`;
    ts = new model.Statistics(doc);
    await ts.save();
  }
  var oneday = (24 * 60 * 60 * 1000);
  var t0 = new Date(moment().format('YYYY-MM-DD 00:00:00.000+08:00')).getTime();
  var t1 = t0 + oneday;
  var votes = await model.Vote.find({ state: 0, $or: [{ $and: [{ start: { $gte: t0 } }, { start: { $lt: t1 } }] }, { $and: [{ end: { $gte: t0 } }, { start: { $lt: t1 } }] }] }).select({ _id: 1 }).exec();
  votes = _.map(votes, n => n.toObject());
  for (var i = 0; i < votes.length; i++) {
    ts = await model.Statistics.findOne({ voteId: votes[i]._id, ..._.pick(today, ['year', 'month', 'day']), });
    if (!ts) {
      let doc = {
        _id: utils.uniqid(), voteId: votes[i]._id,
        ..._.pick(today, ['year', 'month', 'day']),
        newUserCount: makeRandomNumber(),
        viewCount: makeRandomNumber(),
        voteCount: makeRandomNumber(),
        voteRecordCount: makeRandomNumber(),
        voteUserCount: makeRandomNumber(),
        activeCount: makeRandomNumber(),
        activeUserCount: makeRandomNumber(),
        createdAt: utils.nowDate(), createtime: utils.nowTime(),
        updatedAt: utils.nowDate(), updatetime: utils.nowTime(),
      };
      doc.Date = `${doc.year}-${doc.month}-${doc.day}`;
      ts = new model.Statistics(doc);
      await ts.save();
    }
  }
  var t2 = t1 + oneday;
  votes = await model.Vote.find({ state: 0, $or: [{ $and: [{ start: { $gte: t1 } }, { start: { $lt: t2 } }] }, { $and: [{ end: { $gte: t1 } }, { start: { $lt: t2 } }] }] }).select({ _id: 1 }).exec();
  votes = _.map(votes, n => n.toObject());
  for (var i = 0; i < votes.length; i++) {
    ts = await model.Statistics.findOne({ voteId: votes[i]._id, ..._.pick(tomorrow, ['year', 'month', 'day']), });
    if (!ts) {
      let doc = {
        _id: utils.uniqid(), voteId: votes[i]._id,
        ..._.pick(tomorrow, ['year', 'month', 'day']),
        newUserCount: makeRandomNumber2(),
        viewCount: makeRandomNumber2(),
        voteCount: makeRandomNumber2(),
        voteRecordCount: makeRandomNumber2(),
        voteUserCount: makeRandomNumber2(),
        activeCount: makeRandomNumber2(),
        activeUserCount: makeRandomNumber2(),
        createdAt: utils.nowDate(), createtime: utils.nowTime(),
        updatedAt: utils.nowDate(), updatetime: utils.nowTime(),
      };
      doc.Date = `${doc.year}-${doc.month}-${doc.day}`;
      ts = new model.Statistics(doc);
      await ts.save();
    }
  }
}
var job4 = new CronJob('0 */10 * * * *', function () {
  try {
    console.log('统计数据')
    doStatistics();
  } catch (e) {
    console.error(e);
  }
}, null, true, 'Asia/Shanghai', job4, true);
function makeRandomNumber() {
  return 0;
}
function makeRandomNumber2() {
  return 0;
}