const mongoose = require('mongoose');
const TName = "cmb.transdata"; //表名

const transdataSchema = new mongoose.Schema(
  {
    _id: String, //用户ID
    from: { type: String, index: true },
    modal: { type: String, index: true },
    method: { type: String, index: true },
    userId: { type: String, index: true },
    headers: Object,
    cookies: Object,
    params: Object,
    query: Object,
    body: Object,
    result: Object,
    createtime: Number, //创建时间
  },
  { versionKey: false, collection: TName, strict: false }
);
transdataSchema.index({ 'result.code': 1 });
const Transdata = mongoose.model(TName, transdataSchema);

module.exports = {
  Transdata,
};