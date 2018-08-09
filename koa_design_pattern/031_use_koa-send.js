const send = require('./030_koa-send');
const Koa = require('koa');
const app = new Koa();


// public/ 为当前项目静态文件目录
app.use(async ctx => {
  await send(ctx, ctx.path, { root: `${__dirname}/public` });
});

app.listen(3000);
console.log('listening on port 3000');