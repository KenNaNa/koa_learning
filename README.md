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
