const fs = require('fs');
const path = require('path');
const async = require('async');
const utils = require('./utils');
const config = require('./config');
const model = require('./model');
const mkdirp = require('mkdirp');
const moment = require('moment');
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

module.exports = async function upload(req, res) {
  const reqBody = req.body;
  const uploadFile = req.file;
  let { faid, name, chunk, chunks } = reqBody;
  res.removeHeader('X-Powered-By');
  if (!chunk || !chunks) {
    res.json({ code: 1, msg: '上传失败：参数错误' });
    return res.end();
  }
  chunk = Number(chunk);
  chunks = Number(chunks);
  const ip = utils.getClientIp(req);
  if (uploadFile) {
    let { mimetype, destination, filename, size, } = uploadFile;
    const src = path.join(destination, filename);
    var originalname = name;
    const extname = path.extname(name);
    //2020-05-21 新增 严格检查文件后缀
    let result = utils.checkFileExt(extname);
    console.log('checkFileExt', result);
    if (result.code == 1) {
      fs.unlinkSync(src);
      res.json(result);
      return res.end();
    }
    if (chunk == 0) await model.FileTemp.findByIdAndUpdate(faid, { $set: { filesize: 0, filelist: [] } }, { upsert: true });
    await model.FileTemp.findByIdAndUpdate(faid, { $inc: { filesize: size }, $addToSet: { filelist: { chunk, destination, filename } } }, { upsert: true });
    if (chunks == 1) {//文件小于5m
      //2020-03-23 新增 严格检查文件格式和大小
      result = await utils.checkFile(src);
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
    } else {//文件大于5m
      if (chunk == 0) {//第一个文件块
        //2020-03-23 新增 严格检查文件格式和大小
        result = await utils.checkFile(src);
        if (result.code == 1) {
          res.json(result);
          return res.end();
        }
        //检查结束
      }
      if (chunks > config.upload.maxchunks) {
        res.json({ code: 1, msg: '上传失败：文件超过最大限制' });
        return res.end();
      }
      if (chunk + 1 == chunks) {//最后一个文件块
        filename = utils.makeUUID() + extname;
        const { savepath, basepath } = getSavePath();
        const dest = path.join(savepath, filename);
        const dstream = fs.createWriteStream(dest);
        const { filelist, filesize } = await model.FileTemp.findById(faid, { filelist: 1, filesize: 1 });
        filelist.sort((a, b) => a.chunk - b.chunk);
        await combindAndUpload(filelist, dstream);
        //2020-03-23 新增 严格检查文件格式和大小
        result = await utils.checkFile(dest);
        if (result.code == 1) {
          res.json(result);
          return res.end();
        }
        //检查结束
        const url = path.join('/voteSrv/upload', basepath, filename).replace(/\\/g, '/');
        console.log(url);
        const file = new model.File({
          _id: utils.uniqid(), filename, originalname, mimetype, url, path: dest, size: filesize, ip, state: 0, createdAt: utils.nowDate(), createtime: utils.nowTime(),
        });
        await file.save();
        res.json({ code: 0, data: url });
        res.end();
      } else {
        res.json({ code: 0 });
        res.end();
      }
    }
  } else {
    res.json({ code: 1, msg: "上传失败：文件不存在" });
    res.end();
  }
}

async function combindAndUpload(filelist, dstream) {
  return new Promise((resolve, reject) => {
    async.eachSeries(filelist, (file, callback) => {
      let src = path.join(file.destination, file.filename);
      let cstream = fs.createReadStream(src);
      cstream.on("end", function () {
        fs.unlinkSync(src);
        callback(null);
      });
      if (file.chunk == filelist.length) cstream.pipe(dstream, { end: true });
      else cstream.pipe(dstream, { end: false });
    }, (err) => {
      resolve();
    });
  });
}