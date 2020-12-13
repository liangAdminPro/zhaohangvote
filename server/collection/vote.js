const mongoose = require('mongoose');

const TName = "cmb.vote"; //表名

const voteSchema = new mongoose.Schema(
  {
    _id: String, //账户ID
    bindId: { type: String, default: '' }, //关联活动ID
    title: String, //活动标题
    tag: String, //活动标签
    tagp: { type: String, index: true },//活动标签拼音
    address: String, //活动地点
    cover: String, //活动封面
    posterbg: String, //活动海报背景图
    start: Number, //开始时间
    end: Number, //结束时间
    shareshorturl: String, //分享短链
    desc: String, //规则介绍 可以是富文本
    rule: Object, //投票规则
    gcwrule: Object, //广场舞投票规则
    lotteryUrl: { type: String, default: '' }, //抽奖地址
    lotteryDesc: { type: String, default: '' }, //抽奖规则
    formset: Object, //自定义表单
    state: { type: Number, index: true }, //状态 0:正常 1:无效
    recommend: { type: Boolean, index: true, default: false, }, //推荐 false:不推荐 true:推荐
    publish: { type: Boolean, index: true, default: false, }, //发布状态 false:未发布 true:已发布
    self_registration: { type: Boolean, default: true },// 是否开启自主报名
    createdAt: Date, //创建时间
    createdBy: String, //创建者ID
  },
  { versionKey: false, collection: TName, strict: false }
);
const Vote = mongoose.model(TName, voteSchema);

module.exports = {
  Vote,
};