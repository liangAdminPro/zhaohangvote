const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const serveStatic = require('serve-static');
const router = require('./router.js')(express.Router());

const app = express();
const server = require('http').Server(app);

app.disable('x-powered-by');
app.use(logger(':date[iso] :method :url :status :response-time ms - :req[content-length] - :res[content-length]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/voteSrv/upload', serveStatic(path.join(__dirname, '../upload'), {
  setHeaders: (res, path, stat) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.removeHeader('X-Powered-By');
  }
}));
app.use('/voteSrv/', serveStatic(path.join(__dirname, '../dist2'), {
  setHeaders: (res, path, stat) => {
    res.removeHeader('X-Powered-By');
  }
}));
app.use(compression({ filter: shouldCompress }));
app.use(router);

const port = (process.env.PORT || 3000);
const host = (process.env.BIND_IP || '127.0.0.1');
server.listen(port, host, function () {
  console.log(`Express server listening on http://${host}:${port}`);
});
function shouldCompress(req, res) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
}
