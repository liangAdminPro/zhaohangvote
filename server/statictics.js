const model = require('./model');
const db = require('./db');
const _ = require('underscore');
const utils = require('./utils');

async function doStatistics(today) {
  today = today || utils.nowDateObj();
  const { year, month, day } = today;
  const voteRecords = await model.Record.find({ voteDate: `${year}-${month}-${day}` }).select({ voteId: 1, userId: 1, _id: 0 }).exec();
  const activeUsers = await model.ActiveUsers.find({ year, month, day, }).select({ voteId: 1, userId: 1, _id: 0 }).exec();
  let record_data = {}, user_data = {};
  voteRecords.forEach(({ voteId, userId }) => {
    let _voteId = '';
    if (!record_data[_voteId]) record_data[_voteId] = { type: 'voteUserCount', voteId: _voteId, count: 0, users: {} };
    if (!record_data[_voteId].users[userId]) {
      record_data[_voteId].count++;
      record_data[_voteId].users[userId] = true;
    }
    _voteId = voteId;
    if (!record_data[_voteId]) record_data[_voteId] = { type: 'voteUserCount', voteId: _voteId, count: 0, users: {} };
    if (!record_data[_voteId].users[userId]) {
      record_data[_voteId].count++;
      record_data[_voteId].users[userId] = true;
    }
  });
  activeUsers.forEach(({ voteId, userId }) => {
    let _voteId = '';
    if (!user_data[_voteId]) user_data[_voteId] = { type: 'activeUserCount', voteId: _voteId, count: 0, users: {} };
    if (!user_data[_voteId].users[userId]) {
      user_data[_voteId].count++;
      user_data[_voteId].users[userId] = true;
    }
    _voteId = voteId;
    if (!user_data[_voteId]) user_data[_voteId] = { type: 'activeUserCount', voteId: _voteId, count: 0, users: {} };
    if (!user_data[_voteId].users[userId]) {
      user_data[_voteId].count++;
      user_data[_voteId].users[userId] = true;
    }
  });
  record_data = _.values(record_data);
  user_data = _.values(user_data);
  let data = record_data.concat(user_data);
  for (let i = 0; i < data.length; i++) {
    await db.addStatistics(_.pick(data[i], ['type', 'voteId', 'count']), today);
  }
}

module.exports = doStatistics;