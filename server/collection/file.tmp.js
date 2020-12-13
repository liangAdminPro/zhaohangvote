const mongoose = require('mongoose');

const TName = "cmb.files.tmp"; //表名

const fileSchema = new mongoose.Schema(
  {
    _id: String, //账户ID
    filelist: [Object],//分段文件列表
    filesize: Number,//文件大小
    createdAt: Date, //上传时间
  },
  { versionKey: false, collection: TName, strict: false }
);
const FileTemp = mongoose.model(TName, fileSchema);

module.exports = {
  FileTemp,
};