# koa_learning
koa 框架学习

# es6 学习
https://babel.bootcss.com/learn-es2015/

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
server.use((context)=>{
  context.body = "koa is ok";
})

//监听端口
server.listen(8080,()=>{
  console.log("The local server is running on port 8080");
})
```
