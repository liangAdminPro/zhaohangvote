const model = require('./model');
const utils = require('./utils');

//检查投票资格 和 权重
async function checkVote({ voteId, itemId, userId, level, wlevel, rule, gcwrule, year, month, day }) {
  if (gcwrule) return await checkGCW({ voteId, itemId, userId, level, wlevel, rule, gcwrule, year, month, day });
  let recordcount = 0, votetimes = 0, voteable = false, voted = false;
  if (!level) level = 'default';
  if (rule.rate == 'total') {//活动周期内
    recordcount = await model.Record.countDocuments({ voteId, userId });
  } else if (rule.rate == 'everyday') {//活动周期内每天
    recordcount = await model.Record.countDocuments({ voteId, userId, voteYear: year, voteMonth: month, voteDay: day });
  } else if (rule.rate == 'everyteam+everyday') {//活动周期内每队每天
    recordcount = await model.Record.countDocuments({ voteId, itemId, userId, voteYear: year, voteMonth: month, voteDay: day });
  }
  if (rule[level] > votetimes) votetimes = rule[level];
  if (rule[wlevel] > votetimes) votetimes = rule[wlevel];
  voted = (votetimes > 0 && recordcount >= rule.count);
  voteable = (votetimes > 0 && recordcount < rule.count)
  return utils.ResObj({ voteable, voted, votetimes });
}
//第四届广场舞大赛投票规则
async function checkGCW({ voteId, itemId, userId, level, wlevel, gcwrule, year, month, day }) {
  let recordcount = 0, votetimes = 0, voteable = false, voted = false;
  var rule = gcwrule[level] || gcwrule[wlevel] || gcwrule['default'];
  if (rule.rate == 'total') {//活动周期内
    recordcount = await model.Record.countDocuments({ voteId, userId });
  } else if (rule.rate == 'everyday') {//活动周期内每天
    recordcount = await model.Record.countDocuments({ voteId, userId, voteYear: year, voteMonth: month, voteDay: day });
  } else if (rule.rate == 'everyteam+everyday') {//活动周期内每队每天
    recordcount = await model.Record.countDocuments({ voteId, itemId, userId, voteYear: year, voteMonth: month, voteDay: day });
  }
  if (rule.times > votetimes) votetimes = rule.times;
  voted = (rule.count > 0 && recordcount >= rule.count);
  voteable = (rule.count > 0 && recordcount < rule.count)
  return utils.ResObj({ voteable, voted, votetimes });
}

module.exports = {
  checkVote,
}