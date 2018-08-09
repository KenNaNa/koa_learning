const Koa = require('koa');
const Router = require('./041_koa-router');
const app = new Koa();

// 初始化路由实例
const router = new Router();

// 注册路由请求信息缓存到实例中
router.get('/index', async ctx => { ctx.body = 'index page'; });
router.get('/post', async ctx => { ctx.body = 'post page'; });
router.get('/list', async ctx => { ctx.body = 'list page'; });
router.get('/item', async ctx => { ctx.body = 'item page'; });

// 路由实例输出父中间件 router.routes()
app.use(router.routes());

app.use(async ctx => {
  ctx.body = '404';
});

app.listen(3000);
console.log('listening on port 3000');