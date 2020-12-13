const user = require('./user');
const admin = require('./admin');
const vote = require('./vote');
const item = require('./vote.item');
const record = require('./vote.record');
const file = require('./file');
const whitelist = require('./whitelist');
const filetemp = require('./file.tmp');
const statistics = require('./statistics');
const userlog = require('./user.log');
const transdata = require('./transdata');

module.exports = {
  ...user,
  ...admin,
  ...vote,
  ...item,
  ...record,
  ...file,
  ...whitelist,
  ...filetemp,
  ...statistics,
  ...userlog,
  ...transdata,
};