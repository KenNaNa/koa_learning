const Koa = require('koa');
const logger = require('./028_koa-logger');
const app = new Koa();

app.use(logger);

app.use(async(ctx, next) => {
  ctx.body = 'hello world';
});

app.listen(3000, () => {
  console.log('[demo] is starting at port 3000');
});