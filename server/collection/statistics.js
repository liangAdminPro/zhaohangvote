const mongoose = require('mongoose');

const TName = "cmb.statistics"; //表名

const statisticsSchema = new mongoose.Schema(
  {
    _id: String, //ID
    voteId: { type: String, index: true, default: "" },//活动ID
    createdAt: Date, //创建时间
    updatedAt: Date,
    Date: { type: String, index: true },
    year: { type: String, index: true },
    month: { type: String, index: true },
    day: { type: String, index: true },
    newUserCount: Number,//新用户
    viewCount: Number,//访问数
    voteCount: Number,//投票数
    voteRecordCount: Number,//投票记录数
    voteUserCount: Number,//投票用户
    activeCount: Number,//活跃数
    activeUserCount: Number,//活跃用户数
  },
  { versionKey: false, collection: TName, strict: false }
);
const Statistics = mongoose.model(TName, statisticsSchema);
const activeUsersSchema = new mongoose.Schema(
  {
    _id: String,
    voteId: { type: String, index: true, default: "" },//活动ID
    userId: { type: String, index: true },
    Date: { type: String, index: true },
    year: { type: String, index: true },
    month: { type: String, index: true },
    day: { type: String, index: true },
    createtime: { type: String, index: true },
  },
  { versionKey: false, collection: TName + ".activeusers", strict: false }
);
const ActiveUsers = mongoose.model(TName + ".activeusers", activeUsersSchema);
module.exports = {
  Statistics,
  ActiveUsers,
};