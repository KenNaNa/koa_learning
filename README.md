# koa_learning
koa 框架学习

# es6 学习
https://babel.bootcss.com/learn-es2015/

# node.js 学习博客

http://blog.fens.me/series-nodejs/

# koa 简介
>Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。
通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 
Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。


# 安装
npm install koa  注意 node 的版本在 7 以上


# 应用程序
```
//引入模块
const koa = require("koa")

//创建服务器
let server = new koa()


//处理响应
server.use((context,next)=>{
  context.body = "koa is ok";
})

//监听端口
server.listen(8080,()=>{
  console.log("The local server is running on port 8080");
})
```


# context 上下文对象
> 该对象类似于原生 http 中的 req 和 res

# next 调用下一个中间件

# request 对象
```
- ctx.request.url(ctx.url)
- ctx.request.method(ctx.method)
- ctx.request.headers(ctx.headers)


const Koa = require("koa")
const server = new Koa()
server.use((context,next)=>{
  console.log(context.request.url);
  console.log(context.request.method);
  console.log(context.request.headers);
})
server.listen(8080,()=>{
  console.log("the local server is running on port 8080");
})
```

# response 对象
```
- ctx.response.set(ctx.set)  __函数:参数key,val__
- ctx.response.status(ctx.status)
- ctx.response.body(ctx.body)  


const Koa = require("koa")
const server = new Koa()
server.use((context,next)=>{
  console.log(context.response.set("myKey","myValue"));
  console.log(context.response.status=200);
  console.log(context.response.body="<p>Hello</p>");
})
server.listen(8080,()=>{
  console.log("the local server is running on port 8080");
})
```

# async + await === promise
```
const fs = require("fs")
const Koa = require("koa")
const app == new Koa()
function asyncFile(){
    return new Promise((resolve,reject)=>{
      fs.readFile("./index.html",(err,data)=>{
        if(err){
          reject(err)
          return 
        }else{
          resolve(data)
        }

      })
    })
}
app.use(async(ctx)=>{
  if(ctx.url==='/'){
    console.log("hello")
    let data  = await asyncFile()
    console.log(data.toString())
    ctx.body = data.toString();
  }

})

app.listen(8080,()=>{
  console.log("The local server is running on port 8080");
})
```

# 这里的 app.listen(...) 方法只是以下方法的语法糖
```
const http = require('http');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
```

# 这意味着您可以将同一个应用程序同时作为 HTTP 和 HTTPS 或多个地址
```
const http = require('http');
const https = require('https');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);
```

# koa 错误处理
>默认情况下，将所有错误输出到 stderr，除非 app.silent 为 true。 
当 err.status 是 404 或 err.expose 是 true 时默认错误处理程序也不会输出错误。 
要执行自定义错误处理逻辑，如集中式日志记录，您可以添加一个 “error” 事件侦听器：
```
app.on('error', err => {
  log.error('server error', err)
});
```
>如果 req/res 期间出现错误，并且 _无法_ 响应客户端，Context实例仍然被传递
```
app.on('error', (err, ctx) => {
  log.error('server error', err, ctx)
});
```

# 中间件 koa-bodyparser
```
const bodyparser = require("koa-bodyparser")
```

# koa-router 路由中间件
```
const koa = require('koa')
const app = new koa();
const Router = require('koa-router')
const router = new Router()
router.get('/',async (ctx)=>{
  ctx.body = "首页";
})

router.post('/post',async (ctx)=>{
  ctx.body = ctx.request.body;
})

app.use(router.routes())

app.listen(8080,()=>{
  console.log("The local server is running on port 8080");
})
```


# koa-static 处理静态资源
```
const koaStatic = require('koa-static')
const path = require('path')
const koa = require('koa')
const app = new koa()

app.use(koaStatic(path.resolve('./public)))
```

# koa-art-template 模板
```
const render =  require("koa-art-template")
const path = require('path')
const koa = require('koa')
const app = new koa()
render(app,{
  root:path.join(__dirname,'view'),
  extname:'.art',
  debug:process.env.NODE_ENV != 'production'
})
app.use(aysnc (ctx)=>{
  await ctx.render('user')
})

app.listen(8080,()=>{
  console.log("The local server is running on port 8080");
})

```

# koa-session 中间件
```
const session = require('koa-session');
const Koa = require('koa');
const app = new Koa();
 
app.keys = ['some secret hurr'];
 
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
 
app.use(session(CONFIG, app));
// or if you prefer all default config, just use => app.use(session(app));
 
app.use(ctx => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;
 
  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + ' views';
});
 
app.listen(3000);
console.log('listening on port 3000');
```

# 小实战 login 登录页面的整合
```
```


# 聊天室实战

```

```

# soket.io 实时通信
```
io.on('connection', function(socket){
  socket.emit('request', /* */); // emit an event to the socket
  io.emit('broadcast', /* */); // emit an event to all connected sockets
  socket.on('reply', function(){ /* */ }); // listen to the event
});
```


```
var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('event', function(data){});
  client.on('disconnect', function(){});
});
server.listen(3000);
```

```
var io = require('socket.io')();
io.on('connection', function(client){});
io.listen(3000);
```

```
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });
server.listen(3000);
```

```
var app = require('koa')();
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });
server.listen(3000);
```

# socket.io-client 客户端
```
<script src="/socket.io/socket.io.js"></script>
<script>
  var socket = io('http://localhost');
  socket.on('connect', function(){});
  socket.on('event', function(data){});
  socket.on('disconnect', function(){});
</script> 
// with ES6 import
import io from 'socket.io-client';
 
const socket = io('http://localhost');
```


```
Node.JS (server-side usage)
Add socket.io-client to your package.json and then:

var socket = require('socket.io-client')('http://localhost');
socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});

```

# socket 服务器端
```
const Koa = require( 'koa' )
const IO = require( 'koa-socket' )
 
const app = new Koa()
const io = new IO()
 
app.use( ... )
 
io.attach( app )
 
io.on( 'join', ( ctx, data ) => {
  console.log( 'join event fired', data )
})
 
app.listen( process.env.PORT || 3000 )
```


```
const Koa = require( 'koa' )
const IO = require( 'koa-socket' )
 
const app = new Koa()
const io = new IO()
 
// Attach the socket to the application
io.attach( app )
 
// Socket is now available as app.io if you prefer
app.io.on( event, eventHandler )
 
// The raw socket.io instance is attached as app._io if you need it
app._io.on( 'connection', sock => {
  // ...
})
 
// app.listen is mapped to app.server.listen, so you can just do:
app.listen( process.env.PORT || 3000 )
 
// *If* you had manually attached an `app.server` yourself, you should do:
app.server.listen( process.env.PORT || 3000 )
```

```
const Koa = require( 'koa' )
const IO = require( 'koa-socket' )
const co = require( 'co' )
 
const app = new Koa()
const io = new IO()
 
app.use( ... )
 
io.use( co.wrap( function *( ctx, next ) {
  let start = new Date()
  yield next()
  console.log( `response time: ${ new Date() - start }ms` )
}))
 
io.use( ... );
 
io.on( 'message', ( ctx, data ) => {
  console.log( `message: ${ data }` )
})
 
io.attach( app )
app.listen( 3000 );
```

```

```

