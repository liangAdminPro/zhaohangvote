const mongoose = require('mongoose');

const TName = "cmb.whitelist"; //表名

const whitelistSchema = new mongoose.Schema(
  {
    _id: String, //ID
    voteId: { type: String, index: true }, //活动ID
    wid: { type: String, unique: true }, //手机号 或者 身份证号
    level: { type: String, index: true }, //用户级别 W5:5W W10:10W
    phone: { type: String, index: true }, //手机号
    idno: { type: String, index: true }, //身份证号
    name: String, //姓名
    birth: String, //生日
    state: { type: Number, index: true }, //状态 0:正常 1:无效
    createdAt: Date, //创建时间
    createdBy: String, //创建者ID
  },
  { versionKey: false, collection: TName, strict: false }
);
whitelistSchema.index({ voteId: 1, phone: 1 }, { unique: true });
const WhiteList = mongoose.model(TName, whitelistSchema);

module.exports = {
  WhiteList,
};