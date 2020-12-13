const path = require('path');
const _ = require('underscore');
const utils = require('./utils');
const config = require('./config');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../tmp') });
const bll = require('./bll');
const uploadFile = require('./upload');
const pluploadFile = require('./plupload');
const checkToken = require('./middleware/checkToken');
const ResultInfo = require('./ResultInfo');
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;
const db = require('./db');
// const rsa = require('./rsa');
// const RsaServer = rsa.server;
// const RsaClient = rsa.client;

const REQ_SPEED_LIMIT = {};
const REQ_SPEED_LIMIT_METHOD = {
  'record/add': true
};
function WPost(req, res) {
  doPost('web', req, res);
}
function MPost(req, res) {
  doPost('mobile', req, res);
}
function PostInit(req, res) {
  doPost('', req, res);
}
async function doPost(from, req, res) {
  const { modal, method } = getkey(req.params);
  const action = bll[modal][method];
  const ip = utils.getClientIp(req);
  res.removeHeader('X-Powered-By');
  //Statistics 记录系统访问量
  if (from == 'mobile') await db.addStatistics({ type: "viewCount" });
  if (Array.isArray(action)) {
    action[0](req.body, { ip, from }, async function (result) {
      await db.saveLog({ from, modal, method, ..._.pick(req, ['headers', 'cookies', 'params', 'query', 'body']), result });
      res.json(result);
      res.end();
    });
  } else if (typeof action == "function") {
    let token = (req.headers['authorization'] || "").split(' ')[1];
    if (!token) {
      let result = await bll.user.login(req, { ip });
      if (result.code != 0) {
        await db.saveLog({ from, modal, method, ..._.pick(req, ['headers', 'cookies', 'params', 'query', 'body']), result });
        res.json(result);
        return res.end();
      }
      token = result.data.token;
    }
    checkToken(token, ip, async function (resInfo) {
      if (resInfo.code == 0) {
        const user = { ...resInfo.data, ip, from };
        if (from == 'mobile') {
          //Statistics 记录系统活跃用户
          await db.addStatistics({ type: 'activeCount' });
          await db.addActiveUser({ userId: user.userId });
        }
        if (REQ_SPEED_LIMIT_METHOD[`${modal}/${method}`]) {//限速接口
          if (REQ_SPEED_LIMIT[user.userId] && (Date.now() - REQ_SPEED_LIMIT[user.userId]) < config.req_speed_limit) {
            let result = setError(ResCode.ERR_REQ_SPEED_LIMIT)
            await db.saveLog({ from, modal, method, ..._.pick(req, ['headers', 'cookies', 'params', 'query', 'body']), result });
            res.json(result);
            return res.end();
          }
          REQ_SPEED_LIMIT[user.userId] = Date.now();
        }
        action(req.body, user, async function (result) {
          await db.saveLog({ from, modal, method, userId: user.userId || user._id, ..._.pick(req, ['headers', 'cookies', 'params', 'query', 'body']), result });
          res.json(result);
          res.end();
        });
      } else {
        await db.saveLog({ from, modal, method, ..._.pick(req, ['headers', 'cookies', 'params', 'query', 'body']), result: resInfo });
        res.json(resInfo);
        res.end();
      }
    });
  } else {
    res.status(404).end();
  }
}
async function preUpload(req, res, doUpload) {
  const ip = utils.getClientIp(req);
  let token = (req.headers['authorization'] || "").split(' ')[1];
  // console.log('preUpload', token, ip, req.cookies);
  if (!token) {
    let result = await bll.user.login(req, { ip });
    if (result.code != 0) {
      await db.saveLog({ from, modal, method, ..._.pick(req, ['headers', 'cookies', 'params', 'query', 'body']), result });
      res.json(result);
      return res.end();
    } else {
      if (!result.data.login) {
        res.json({ code: 1, msg: "未授权用户，禁止上传" });
        return res.end();
      }
    }
    token = result.data.token;
  }
  checkToken(token, ip, async function (resInfo) {
    if (resInfo.code == 0) {
      doUpload(req, res);
    } else {
      await db.saveLog({ from, modal, method, ..._.pick(req, ['headers', 'cookies', 'params', 'query', 'body']), result: resInfo });
      res.json(resInfo);
      res.end();
    }
  });
}
function getkey(params) {
  const modal = params.modal;
  const controller = params.controller;
  const action = params.action;
  return { modal, method: controller + (action ? '_' + action : '') };
}
module.exports = function (router) {
  router.post('/voteSrv/api/upload', upload.single('file'), function (req, res) {
    preUpload(req, res, uploadFile);
  });
  router.post('/voteSrv/api/plupload', upload.single('file'), function (req, res) {
    preUpload(req, res, pluploadFile);
  });
  router.post('/voteSrv/api/:modal/:controller/:action?', PostInit);
  router.post('/voteSrv/wapi/:modal/:controller/:action?', WPost);
  router.post('/voteSrv/mapi/:modal/:controller/:action?', MPost);
  return router;
};
