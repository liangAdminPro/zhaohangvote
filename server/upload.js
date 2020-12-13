const path = require('path');
const fs = require('fs');
const utils = require('./utils');
const model = require('./model');
const mkdirp = require('mkdirp');
const moment = require('moment');
const _ = require('underscore');
moment.locale('zh-cn');
const uploadpath = path.join(__dirname, '../upload/');
if (!fs.existsSync(uploadpath)) mkdirp.sync(uploadpath);
function getSaveBasePath() {
  return moment().format('/YYYY/MM/DD/');
}
function getSavePath() {
  const basepath = getSaveBasePath();
  const savepath = path.join(uploadpath, basepath);
  if (!fs.existsSync(savepath)) mkdirp.sync(savepath);
  return { savepath, basepath };
}
async function upload(req, res) {
  const uploadFile = req.file;
  const ip = utils.getClientIp(req);
  res.removeHeader('X-Powered-By');
  if (uploadFile) {
    let { originalname, mimetype, destination, filename, size } = uploadFile;
    const src = path.join(destination, filename);
    const extname = path.extname(originalname);
    //2020-05-21 新增 严格检查文件后缀
    let result = utils.checkFileExt(extname);
    console.log('checkFileExt', result);
    if (result.code == 1) {
      fs.unlinkSync(src);
      res.json(result);
      return res.end();
    }
    //2020-03-23 新增 严格检查文件格式和大小
    result = await utils.checkFile(src);
    console.log('checkFile', result);
    if (result.code == 1) {
      res.json(result);
      return res.end();
    }
    //检查结束
    filename = filename + extname;
    const { savepath, basepath } = getSavePath();
    const dest = path.join(savepath, filename);
    const url = path.join('/voteSrv/upload', basepath, filename).replace(/\\/g, '/');
    console.log(url);
    const file = new model.File({
      _id: utils.uniqid(), filename, originalname, mimetype, url, path: dest, size, ip, state: 0, createdAt: utils.nowDate(), createtime: utils.nowTime(),
    });
    fs.copyFileSync(src, dest);
    fs.unlinkSync(src);
    await file.save();
    var data = { code: 0, data: url };
    res.json(data);
    res.end();
  } else {
    var result = { code: 1, msg: "上传失败" };
    res.json(result);
    res.end();
  }
}
async function copy(src) {
  let ofile = await model.File.findOne({ url: src });
  if (ofile) {
    ofile = ofile.toObject();
    const extname = path.extname(ofile.path);
    const basename = path.basename(ofile.path);
    const destpath = ofile.path.replace(basename, '');
    const filename = utils.makeUUID() + extname;
    const dest = path.join(destpath, filename);
    const url = ofile.url.replace(basename, filename);
    const file = new model.File({
      _id: utils.uniqid(), ..._.pick(ofile, ['originalname', 'mimetype', 'size', 'ip']),
      filename, url, path: dest, state: 0, createdAt: utils.nowDate(),
    });
    await file.save();
    fs.copyFileSync(ofile.path, dest);
    return utils.ResObj(url);
  }
  return utils.ResObj('');
}
module.exports = upload;