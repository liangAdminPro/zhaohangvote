const mongoose = require('mongoose');

const TName = "cmb.vote.item"; //表名

const itemSchema = new mongoose.Schema(
  {
    _id: String, //账户ID
    voteId: { type: String, index: true }, //活动ID
    userId: { type: String, index: true }, //用户ID
    titleprefix: { type: String, default: '' }, //队伍名/个人名 前缀
    title: String, //队伍名/个人名
    linkman: String, //负责人
    linkphone: String, //联系电话
    cover: String, //封面
    images: [String], //精彩图片
    videos: [String], //参赛视频
    slogan: String, //参赛简介
    votecount: Number, //得票数
    sharecount: Number, //分享数
    viewcount: Number, //浏览数
    state: { type: Number, index: true }, //状态 -1:待审核 0:正常 1:无效
    uids: { type: [String], index: true, default: [] },
    createdAt: Date, //创建时间
    createdBy: String, //创建者ID
  },
  { versionKey: false, collection: TName, strict: false }
);
// itemSchema.index({ voteId: 1, title: 1 }, { unique: true });
const Item = mongoose.model(TName, itemSchema);

module.exports = {
  Item,
};