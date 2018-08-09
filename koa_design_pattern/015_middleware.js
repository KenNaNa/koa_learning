const Koa = require('koa');
let app = new Koa();

const middleware1 = async (ctx, next) => { 
  console.log(1); 
  await next();  
  console.log(6);   
}

const middleware2 = async (ctx, next) => { 
  console.log(2); 
  await next();  
  console.log(5);   
}

const middleware3 = async (ctx, next) => { 
  console.log(3); 
  await next();  
  console.log(4);   
}

app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
app.use(async(ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(3001)

// 启动访问浏览器
// 控制台会出现以下结果
// 1
// 2
// 3
// 4
// 5
// 6
/**
 * 为什么会出现以上的结果， 
 * 这个主要是Koa.js的一个中间件引擎 koa-compose模块来实现的，
 * 也就是Koa.js实现洋葱模型的核心引擎。
 */