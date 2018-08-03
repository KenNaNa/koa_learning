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
    ctx.body = data;
  }

})

app.listen(8080,()=>{
  console.log("The local server is running on port 8080");
})
```
