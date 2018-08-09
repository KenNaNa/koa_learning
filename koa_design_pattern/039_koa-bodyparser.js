const readStream = require('./038_koa-bodyparser');
let strictJSONReg = /^[\x20\x09\x0a\x0d]*(\[|\{)/;

let jsonTypes = [
  'application/json'
];

let formTypes = [
  'application/x-www-form-urlencoded'
];

let textTypes = [
  'text/plain'
];

function parseQueryStr(queryStr) {
  let queryData = {};
  let queryStrList = queryStr.split('&');
  for (let [ index, queryStr ] of queryStrList.entries()) {
    let itemList = queryStr.split('=');
    queryData[ itemList[0] ] = decodeURIComponent(itemList[1]);
  }
  return queryData;
}

function bodyParser(opts = {}) {
  return async function(ctx, next) {
    // 拦截post请求
    if (!ctx.request.body && ctx.method === 'POST') {
      // 解析请求体中的表单信息
      let body = await readStream(ctx.request.req);
      let result = body;
      if (ctx.request.is(formTypes)) {
        result = parseQueryStr(body);
      } else if (ctx.request.is(jsonTypes)) {
        if (strictJSONReg.test(body)) {
          try {
            result = JSON.parse(body);
          } catch (err) {
            ctx.throw(500, err);
          }
        }
      } else if (ctx.request.is(textTypes)) {
        result = body;
      }

      // 将请求体中的信息挂载到山下文的request 属性中
      ctx.request.body = result;
    }
    await next();
  };
}

module.exports = bodyParser;