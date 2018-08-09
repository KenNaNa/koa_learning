// 响应拦截
const Koa = require('koa');
let app = new Koa();

const middleware = async function(ctx, next) {
  ctx.response.type = 'text/text';
  await next();
}

const page = async function(ctx, next) {
  ctx.body = `
      <html>
        <head></head>
        <body>
          <h1>${ctx.path}</h1>
        </body>
      </html>
    `; 
}

app.use(middleware);
app.use(page);

app.listen(3001, function(){
  console.log('the demo is start at port 3001');
})