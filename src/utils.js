const uuidv4 = require('uuid/v4');
export const isCardID = function (code) {
  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    return false;
  }
  if (code.length == 18) {
    //18位身份证需要验证最后一位校验位
    var codeArr = code.split('');
    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];    //加权因子
    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; //校验位
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += codeArr[i] * factor[i];
    }
    if (parity[sum % 11] != codeArr[17]) return false;
  }
  //生日
  var birth = code.substring(6, 10) + '-' + code.substring(10, 12) + '-' + code.substring(12, 14);
  return { birth };
}
export const isMPBank = function () {
  return navigator.userAgent && navigator.userAgent.indexOf('MPBank') > -1;
}
export const sliceFile = function ({ name, size }) {
  let chunksize = 5 * 1024 * 1024;//文件切割最小5M
  let firstchunksize = 1024;//第一个数据包大小
  let res = [];
  if (size <= chunksize) {
    if (size <= firstchunksize) {
      res.push({ chunk: 0, chunks: 1, name });
    } else {
      let chunks = 2;
      res.push({ chunk: 0, chunks, name, from: 0, to: firstchunksize });
      res.push({ chunk: 1, chunks, name, from: firstchunksize, to: size });
    }
  } else {
    let chunks = (size - firstchunksize) % chunksize == 0 ? Math.floor((size - firstchunksize) / chunksize) : Math.floor((size - firstchunksize) / chunksize) + 1;
    let tchunks = chunks + 1;
    res.push({ chunk: 0, chunks: tchunks, name, from: 0, to: firstchunksize });
    for (let i = 0; i < chunks; i++) {
      res.push({ chunk: i + 1, chunks: tchunks, name, from: (i * chunksize) + firstchunksize, to: (i == chunks - 1) ? size : (i + 1) * chunksize + firstchunksize });
    }
  }
  // console.log(res);
  return res;
}
export const makeUUID = function () {
  return uuidv4().replace(/-/g, '');
}
export const makePage = function (page, total) {
  var current = [];
  if (total > 5) {
    //多于5页
    if (page <= 3) {
      var center = 3;
      console.log(center);
      current = [center - 2, center - 1, center, center + 1, center + 2];
    } else if (page >= total - 2) {
      current = [total - 4, total - 3, total - 2, total - 1, total]
    } else {
      current = [page - 2, page - 1, page, page + 1, page + 2];
    }
  } else {
    //少于5页
    for (var i = 0; i < total; i++) {
      current.push(i + 1);
    }
  }
  return current;
}
export const isPhone = function (phone) {
  return /^1[3|4|5|6|7|8|9]\d{9}$/.test(phone);
}