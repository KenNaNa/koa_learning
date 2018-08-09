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
