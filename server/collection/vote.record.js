const mongoose = require('mongoose');

const TName = "cmb.vote.record"; //表名

const recordSchema = new mongoose.Schema(
  {
    _id: String, //账户ID
    voteId: { type: String, index: true }, //活动ID
    itemId: { type: String, index: true }, //项目ID
    userId: { type: String, index: true }, //用户ID
    voteDate: { type: String, index: true }, //投票日期
    voteYear: { type: String, index: true }, //投票日期-年
    voteMonth: { type: String, index: true }, //投票日期-月
    voteDay: { type: String, index: true }, //投票日期-日
    voteTime: { type: String, index: true }, //投票时间
    voteHour: { type: String, index: true }, //投票时间-时
    votecount: Number,//票数
    createdAt: Date, //投票时间
    ip: String, //投票ip
  },
  { versionKey: false, collection: TName, strict: false }
);
const Record = mongoose.model(TName, recordSchema);

module.exports = {
  Record,
};