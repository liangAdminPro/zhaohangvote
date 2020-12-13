var ResCode = exports.ResCode = {
  OK: 0,
  ERR_INTERNAL: 1,
  ERR_TOKEN: 3,                       //token异常
  ERR_OBJECTNULL: 4,                  //请求对象不存在
  ERR_NOPOWER: 5,
  ERR_FORMATE: 8,                     //格式错误
  ERR_REQ_SPEED_LIMIT: 9,

  ERR_ACCOUNT_INVALID: 1000,

  ERR_LOGIN_FAIL: 1001,
  ERR_REMOVE_SELF: 1002,
  ERR_VOTE: 1003,
  ERR_VOTE_SELF_REGISTRATION: 1004,
  ERR_AUTH: 1005,
  ERR_DUPLICATE_ITEM_TITLE: 1006,
  ERR_DUPLICATE_ITEM: 1007,
  ERR_VOTE_NOT_START: 1008,
  ERR_VOTE_ENDED: 1009,
  ERR_DUPLICATE_VOTE_TITLE: 1010,
  ERR_ADMIN_UPDATE_PWD_FAIL: 1011,
  ERR_FORM_TITLE_SHOW: 1012,
  ERR_FORM_TITLE_REQUIRED: 1013,
};

var ErrMessage = {
  base: {
    0: '成功',
    1: '内部错误',
    3: '您的账户异常',
    4: '您请求的数据不存在',
    5: '您没有权限进行此操作',
    8: '您提交的数据有误',
    9: '你操作太快了，请稍后再次尝试',

    1000: '账户无效',

    1001: '登录失败：[账号或密码错误]',
    1002: '删除失败：[不能删除自己]',
    1003: '投票失败：[你不能为该队投票]',
    1004: '提交失败：[该活动不接受自主报名]',
    1005: '授权失败',
    1006: '队名/昵称已存在，请更换后再次提交',
    1007: '你已报名参赛，请勿重复提交',
    1008: '活动未开始',
    1009: '活动已结束',
    1010: '活动名称重复，请更换后再次提交',
    1011: '密码修改失败：原密码不正确',
    1012: '队伍名称/姓名/名称 是必选项',
    1013: '队伍名称/姓名/名称 是必填项',
  }
};

var ResultInfo = function (setCode) {
  this.code = setCode;
};
ResultInfo.prototype.initMsg = function (model) {
  if (!model)
    model = 'base';
  this.msg = ErrMessage[model][this.code];
  return this;
}

exports.setSuccess = function (data) {
  var resInfo = new ResultInfo(ResCode.OK);
  if (data || data == 0)
    resInfo.data = data;
  return resInfo.initMsg();
};
exports.setError = function (errCode, data) {
  var resInfo = new ResultInfo(errCode);
  if (data)
    resInfo.data = data;
  var dd = resInfo.initMsg();
  return dd;
};