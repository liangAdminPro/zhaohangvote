const db = require('../db');
const model = require('../model');
const _ = require('underscore');
const utils = require('../utils');
const Base64 = require('js-base64').Base64;
const ResultInfo = require('../ResultInfo');
const setSuccess = ResultInfo.setSuccess;
const setError = ResultInfo.setError;
const ResCode = ResultInfo.ResCode;
const createToken = require('../middleware/createToken');
const Joi = require('@hapi/joi');

module.exports = {
  /**
   * @description 手机用户登录
   */
  login: async function (req, { ip }) {
    let MobileNo = (req.cookies['cmb.MobileNo'] || '').replace(/ /g, '+');
    let UniqueUserID = (req.cookies['cmb.UniqueUserID'] || '').replace(/ /g, '+');
    let ExpandUserID = (req.cookies['cmb.ExpandUserID'] || '').replace(/ /g, '+');
    let NewUserID = (req.cookies['cmb.NewUserID'] || '').replace(/ /g, '+');
    let Level = (req.cookies['cmb.Level'] || '').replace(/ /g, '+');
    let customerType = (req.cookies['cmb.customerType'] || '').replace(/ /g, '+');
    let PersonalID = (req.cookies['cmb.PersonalID'] || '').replace(/ /g, '+');
    let RealName = (req.cookies['cmb.RealName'] || '').replace(/ /g, '+');
    let XdParams = req.cookies['cmb.XdParams'] || '';
    let OriginalXdParams = req.cookies['cmb.OriginalXdParams'] || '';
    var odata = _.extend({}, { MobileNo, UniqueUserID, ExpandUserID, NewUserID, Level, customerType, PersonalID, RealName, XdParams, OriginalXdParams });
    try {
      XdParams = Base64.decode(XdParams);
    } catch (e) { }
    try {
      OriginalXdParams = Base64.decode(OriginalXdParams);
    } catch (e) { }
    if (!MobileNo && !PersonalID /*TODO && !ExpandUserID*/) return utils.ResObj(setSuccess({ token: createToken({ userId: "", ip }), login: false }));
    const schema = Joi.object().keys({
      MobileNo: Joi.string().allow('').required(),
      UniqueUserID: Joi.string().allow('').required(),
      ExpandUserID: Joi.string().required(),
      NewUserID: Joi.string().allow('').required(),
      Level: Joi.string().allow('').required(),
      customerType: Joi.string().allow('').required(),
      PersonalID: Joi.string().allow('').required(),
      RealName: Joi.string().allow('').required(),
    });
    const res = Joi.validate({
      MobileNo, UniqueUserID, ExpandUserID, NewUserID, Level, customerType, PersonalID, RealName,
    }, schema);
    if (res.error) return utils.ResObj(setError(ResCode.ERR_FORMATE));
    MobileNo = utils.CMBAesDecode(MobileNo);
    UniqueUserID = utils.CMBAesDecode(UniqueUserID);
    ExpandUserID = utils.CMBAesDecode(ExpandUserID);
    NewUserID = utils.CMBAesDecode(NewUserID);
    Level = utils.CMBAesDecode(Level);
    customerType = utils.CMBAesDecode(customerType);
    PersonalID = utils.CMBAesDecode(PersonalID);
    RealName = utils.CMBAesDecode(RealName);
    var data = _.extend({}, { MobileNo, UniqueUserID, ExpandUserID, NewUserID, Level, customerType, PersonalID, RealName, XdParams, OriginalXdParams });
    const result = await db.addUser({
      uid: PersonalID || MobileNo, mobile: MobileNo, uniqueUserId: UniqueUserID, expandUserId: ExpandUserID, newUserId: NewUserID, level: Level, customerType, idno: PersonalID, name: RealName, XdParams, OriginalXdParams,
    });
    if (result.code == 0) {
      //Statistics 记录系统新用户数
      if (result.created) await db.addStatistics({ type: 'newUserCount' });
      return utils.ResObj(setSuccess({ token: createToken({ userId: result.data, ip }), login: true }));
    }
    try {
      let log = new model.UserLog({ _id: utils.uniqid(), odata, data, createdAt: utils.nowDate(), createtime: utils.nowTime() });
      await log.save();
    } catch (e) {
      console.error(e);
    }
    return utils.ResObj(setError(ResCode.ERR_AUTH));
  },
  info: async function (reqBody, user, callback) {
    let userdata = await model.User.findById(user.userId);
    let result = { name: '', rphone: '', phone: '', idno: '', avatar: utils.makeAvatar() };
    if (userdata) {
      userdata = userdata.toObject();
      result.name = userdata.name || '';
      result.rphone = userdata.mobile || '';
      result.phone = utils.hidePhone(userdata.mobile);
      result.idno = userdata.idno || '';
    }
    callback(setSuccess(result));
  },
};