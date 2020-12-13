const mongoose = require('mongoose');
const TName = "cmb.users.log"; //表名

const userLogSchema = new mongoose.Schema(
  {
    _id: String, //用户ID
    odata: Object,
    data: Object,
    createdAt: Date, //创建时间
  },
  { versionKey: false, collection: TName, strict: false }
);
const UserLog = mongoose.model(TName, userLogSchema);

module.exports = {
  UserLog,
};