const NodeRSA = require('node-rsa');
const fs = require('fs');
const path = require('path');
const publicKeyFile = path.join(__dirname, 'key', 'key.pub');
const privateKeyFile = path.join(__dirname, 'key', 'key.pem');
function paraSort(para) {
  var result = {};
  var keys = Object.keys(para).sort();
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    result[k] = para[k];
  }
  return result;
}
function createLinkstring(para) {
  var ls = '';
  for (var k in para) {
    ls = ls + k + '=' + para[k] + '&';
  }
  ls = ls.substring(0, ls.length - 1);
  return ls;
}
const RSA = {
  client: function (key) {
    const pri = new NodeRSA(key, { environment: 'node', signingScheme: 'pkcs1-sha512', });
    const obj = {};
    obj.sign = function (data) {
      if (typeof data != 'object') throw new Error('data must be an object');
      return pri.sign(createLinkstring(paraSort(data)), 'base64', 'utf8');
    }
    obj.encrypt = function (data) {
      if (typeof data != 'object') throw new Error('data must be an object');
      return pri.encryptPrivate(data, 'base64', 'utf8');
    }
    return obj;
  },
  server: function (key) {
    const pub = new NodeRSA(key, { environment: 'node', signingScheme: 'pkcs1-sha512', });
    const obj = {};
    obj.verify = function (data) {
      if (typeof data != 'object') throw new Error('data must be an object');
      const sign = data.sign;
      delete data.sign;
      return pub.verify(createLinkstring(paraSort(data)), sign, 'utf8', 'base64');
    }
    obj.decrypt = function (data) {
      if (typeof data != 'string') throw new Error('data must be string');
      return pub.decryptPublic(data, 'json');
    }
    return obj;
  },
  genkeypair: function () {
    console.time('genkeypair');
    let key = new NodeRSA({ b: 512 });
    key = key.generateKeyPair();
    if (!fs.existsSync(publicKeyFile)) {
      const public = key.exportKey('pkcs8-public');
      fs.writeFileSync(publicKeyFile, public);
    }
    if (!fs.existsSync(privateKeyFile)) {
      const private = key.exportKey('pkcs8-private');
      fs.writeFileSync(privateKeyFile, private);
    }
    console.timeEnd('genkeypair');
    console.log('key pair generated');
  },
};
RSA.genkeypair();
const RsaServer = new RSA.server(fs.readFileSync(publicKeyFile));
const RsaClient = new RSA.client(fs.readFileSync(privateKeyFile));
module.exports = {
  server: RsaServer,
  client: RsaClient,
};