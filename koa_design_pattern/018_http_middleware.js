// 服务使用
const WebServer = require('./index');

const app = new WebServer();
const PORT = 3001;

app.use(ctx => {
  ctx.res.write('<p>line 1</p>');
});

app.use(ctx => {
  ctx.res.write('<p>line 2</p>');
});

app.use(ctx => {
  ctx.res.write('<p>line 3</p>');
});

console.log(app)
app.listen(PORT, () => {
  console.log(`the web server is starting at port ${PORT}`);
});