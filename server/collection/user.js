const mongoose = require('mongoose');

const TName = "cmb.users"; //表名

const userSchema = new mongoose.Schema(
  {
    _id: String, //用户ID
    uid: { type: String, unique: true }, //手机号 或者 身份证号
    mobile: { type: String, index: true, default: '' }, //手机号
    uniqueUserId: { type: String, default: '' },
    expandUserId: String,
    newUserId: { type: String, default: '' },
    level: { type: String, index: true }, //用户级别 default: 无卡 LV1:普卡 LV2:金卡 LV3:金葵花 LV4:钻石卡 LV5:私人银行
    customerType: { type: String, index: true, default: '0' },//客户是否持卡
    idno: { type: String, index: true }, //身份证号
    name: { type: String, default: '' }, //姓名
    sex: { type: String, default: '' }, //性别
    state: { type: Number, index: true }, //状态 0:正常 1:无效
    XdParams: { type: String, default: '' },
    OriginalXdParams: { type: String, default: '' },
    createdAt: Date, //创建时间
  },
  { versionKey: false, collection: TName, strict: false }
);
const User = mongoose.model(TName, userSchema);

module.exports = {
  User,
};