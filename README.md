cd 到 koademo 下

npm install 

js是单线程的，

进程 ：

线程：

中间件的深入原理学习

https://blog.csdn.net/qq673318522/article/details/79090682


https://www.cnblogs.com/Leo_wl/p/4684633.html#_label0


https://blog.csdn.net/shmnh/article/details/50831964


https://www.jianshu.com/p/797a4e38fe77


https://blog.csdn.net/alinachanchan/article/details/78189697


AOP切面编程

AOP 面向切面编程
什么是AOP?
什么是AOP？中文意思是面向切面编程，听起来感觉很模糊。先举个生产的例子。

农场的水果包装流水线一开始只有 采摘 - 清洗 - 贴标签
<img src="https://user-images.githubusercontent.com/8216630/42586566-0014a912-856b-11e8-8e96-6aa54db8f60c.png">

为了提高销量，想加上两道工序 分类 和 包装 但又不能干扰原有的流程，同时如果没增加收益可以随时撤销新增工序。
<img src="https://user-images.githubusercontent.com/8216630/42586569-0113afe8-856b-11e8-9580-4238053ddc60.png">

最后在流水线的中的空隙插上两个工人去处理，形成采摘 - 分类 - 清洗 - 包装 - 贴标签 的新流程，而且工人可以随时撤回。
回到什么是AOP？就是在现有代码程序中，在程序生命周期或者横向流程中 加入/减去 一个或多个功能，不影响原有功能。

Koa.js 的切面
切面由中间件机制实现
一个中间件一般有两个切面
遵循先进后出的切面执行顺序，类似入栈出栈的顺序
<img src="https://user-images.githubusercontent.com/8216630/42587672-084c4402-856e-11e8-8fb4-dde31009baad.png">


洋葱模型切面
前言
Koa.js 最为人所知的是基于 洋葱模型 的HTTP中间件处理流程。

在此，洋葱模式可以拆解成一下几个元素。

生命周期
中间件
中间件在生命周期中
前置操作
等待其他中间件操作
后置操作
中间件流程处理
举个代码例子
```
let context = {
  data: []
};

async function middleware1(ctx, next) {
  console.log('action 001');
  ctx.data.push(1);
  await next();
  console.log('action 006');
  ctx.data.push(6);
}

async function middleware2(ctx, next) {
  console.log('action 002');
  ctx.data.push(2);
  await next();
  console.log('action 005');
  ctx.data.push(5);
}

async function middleware3(ctx, next) {
  console.log('action 003');
  ctx.data.push(3);
  await next();
  console.log('action 004');
  ctx.data.push(4);
}

Promise.resolve(middleware1(context, async() => {
  return Promise.resolve(middleware2(context, async() => {
    return Promise.resolve(middleware3(context, async() => {
      return Promise.resolve();
    }));
  }));
}))
  .then(() => {
    console.log('end');
    console.log('context = ', context);
  });

// 结果显示
// "action 001"
// "action 002"
// "action 003"
// "action 004"
// "action 005"
// "action 006"
// "end"
// "context = { data: [1, 2, 3, 4, 5, 6]}"
```
```
源码元素解析
生命周期就是 Promise.resolve 的嵌套
中间件就是 middleware1、middleware2和middleware3
中间件在生命周期中，就是 Promise.resolve(middleware)嵌套中执行中间件
middleware1 前置操作 action 001
等待嵌套的 middleware2
middleware2 前置操作 action 002
等待嵌套的 middleware3
middleware3 前置操作 action 003
middleware3 后置操作 action 004
middleware2 后置操作 action 005
middleware1 后置操作 action 006
```
```
        +----------------------------------------------------------------------------------+
        |                                                                                  |
        |                              middleware 1                                        |
        |                                                                                  |
        |          +-----------------------------------------------------------+           |
        |          |                                                           |           |
        |          |                    middleware 2                           |           |
        |          |                                                           |           |
        |          |            +---------------------------------+            |           |
        |          |            |                                 |            |           |
        | action   |  action    |        middleware 3             |    action  |   action  |
        | 001      |  002       |                                 |    005     |   006     |
        |          |            |   action              action    |            |           |
        |          |            |   003                 004       |            |           |
        |          |            |                                 |            |           |
+---------------------------------------------------------------------------------------------------->
        |          |            |                                 |            |           |
        |          |            |                                 |            |           |
        |          |            +---------------------------------+            |           |
        |          +-----------------------------------------------------------+           |
        +----------------------------------------------------------------------------------+
```



HTTP切面流程
```
任人打扮的HTTP
从HTTP请求从拿到想要的数据
从拿到数据处理想要处理的事情
给处理后的结果
```
<img src="https://user-images.githubusercontent.com/8216630/42408394-9db3991e-81fe-11e8-8a32-940941ad4480.jpeg">

```
HTTP生命过程
http请求
路由操作
权限处理
数据安全
业务操作
数据操作
书查查询
http响应
响应操作
```
<img src="https://user-images.githubusercontent.com/8216630/42408395-9efe19ca-81fe-11e8-9a6e-3dc5b1896dca.jpeg">

```
Koa.js的HTTP旅程
请求
中间件
响应
```

<img src="https://user-images.githubusercontent.com/8216630/42408401-ada72fca-81fe-11e8-9f05-c5a93bb15670.jpeg">



```
中间件分类
前言
市面上的大部分Web框架，都提供了很多Web相关的能力支持，例如。

HTTP服务
路由管理
模板渲染
日志
插件/中间件等AOP能力
其他能力
Koa.js 作为一个web框架，总结出来只提供了两种能力

HTTP服务
中间件机制（AOP切面）
综上所述，用Koa.js想实现大部分Web功能的话，就需要整合相关功能的中间件。换句话说，Koa.js 说就是中间件的大容器，任何Web所需的能力通过中间件来实现。

Koa.js 中间件的分类，在我的理解，可以分成以下两种类型。

狭义中间件
广义中间件
狭义中间件
狭义中间件特点：

中间件内操作请求 request
中间件内操作响应 response
中间件内操作上下文 context
大多数直接被 app.use() 加载
举个栗子 例如 中间件koa-static主要是靠拦截请求和响应，加载静态资源，中间件koa-bodyparser主要是拦截请求后解析出HTTP请求体重的POST数据，再挂载到ctx上。

广义中间件
广义中间件特点

不直接提供中间件
通过间接方式提供了中间件或者子中间件
间接被 app.use() 加载
其他方式接入Koa切面
举个例子 例如中间koa-router 是先注册路由后形成多个子中间件，后面再封装成一个父中间件提供给app.use()加载，让所有子中间件加载到Koa.js的请求洋葱模型中。
```
