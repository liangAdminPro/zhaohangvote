//全局配置
module.exports = {
  jwt_secret: '5ab3c6ba-d6b2-4a32-a3e7-dfd7251707e0',
  jwt_expire: '90d',//登录有效期
  req_speed_limit: 3000,//接口两次请求最小间隔 毫秒
  cmb_aes_key: 'zhengzhoufenhang',//招行app传参解密密钥
  file_expire_days: 3,//无关联文件最大保存天数 用于定时清理
  tmpfile_expire_days: 1,//临时文件保存天数 用于定时清理
  log_expire_days: 180,//日志最大保存天数 用于定时清理
  //密码加密密钥
  key: '12249570bb024f76933e8ffa47a5dc9e',
  //后台默认初始化账户
  defaultAdmin: {
    mobile: '18538262779',
    name: '王全新',
    role: '1'
  },
  //手机号码格式
  phoneReg: /^1[3|4|5|6|7|8|9]\d{9}$/,
  //上传文件限制
  upload: {
    accpetext: ['.jpg', '.jpeg', '.png', '.mp4'],
    accepttype: ['image/jpeg', 'image/png', 'video/mp4'],
    accepttext: '只允许上传jpg/png/mp4格式文件',
    limitsize: {
      'image/jpeg': 2 * 1024 * 1024,//2M
      'image/png': 2 * 1024 * 1024,//2M
      'video/mp4': 100 * 1024 * 1024,//100M
    },
    maxchunks: 21,//文件分片上传最大数
    limittext: {
      'image/jpeg': '图片不大于2M',
      'image/png': '图片不大于2M',
      'video/mp4': '视频不大于100M',
    },
  },
  //用户等级描述
  user_level: {
    'default': 0,
    'LV1': 1,
    'LV2': 2,
    'LV3': 3,
    'LV4': 4,
    'LV5': 5,
  },
  //白名单等级
  w_level: {
    'W5': 1,
    'W10': 2,
  },
  defaultRule: {
    "count": 1,//可投票次数
    "rate": "total",
    "default": 0,//倍率
    "LV1": 1,//倍率
    "LV2": 1,//倍率
    "LV3": 1,//倍率
    "LV4": 1,//倍率
    "LV5": 1,//倍率
    "W5": 1,//倍率
    "W10": 1//倍率
  },
  gcwrule: {
    "default": { "rate": "everyday", "count": 1, "times": 1, },
    "LV1": { "rate": "everyday", "count": 2, "times": 1, },
    "LV2": { "rate": "everyday", "count": 5, "times": 1, },
    "LV3": { "rate": "everyday", "count": 10, "times": 1, },
    "LV4": { "rate": "everyday", "count": 10, "times": 1, },
    "LV5": { "rate": "everyday", "count": 10, "times": 1, },
    "W5": { "rate": "everyday", "count": 1, "times": 1, },
    "W10": { "rate": "everyday", "count": 1, "times": 1, },
  },
  //app分享短链
  APP_SHARE_SHORT_URL: "https://t.cmbchina.com/v6F7Fj", //TODO 上线时修改 http://mobiletest.cmburl.cn/shorturl/Y7zyyi
  defaultForm: {
    "title": { title: "名称", description: "请输入名称", show: true, required: true },
    "linkman": { title: "负责人姓名", description: "请输入负责人姓名", show: false, required: false },
    "linkphone": { title: "负责人电话", description: "请输入负责人电话", show: false, required: false },
    "images": { title: "图片", description: "上传图片", show: true, required: false },
    "videos": { title: "视频", description: "上传视频", show: true, required: false },
    "slogan": { title: "口号", description: "请输入口号", show: true, required: false },
    "IDnumber": { title: "身份证号", description: "请输入身份证号", show: false, required: false },
    "comefrom": { title: "所属舞队", description: "请输入所属舞队", show: false, required: false, extrashow: false, },
  },
  extraShowForms: ["comefrom"],
};