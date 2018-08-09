学习准备
知识储备
Node.js 的基础知识
http 模块的使用
fs 模块使用
path 模块使用
Buffer 类型
ES 的基础知识
Promise
async/await
其他知识
HTTP 协议
Cookie 原理
环境准备
Linux/Mac 开发环境
nvm 管理 Node.js 版本

回调 一直是JavaScript编程中比较令人纠结的写法，主要场景是用于处理 “并列”或者“并行”的操作，然后在回调函数中处理操作结果。这样子原生的回调写法就会带来一下的不便。

回调结果状态不便管理
回调方式自由松散，没有规范约束


Promise能力
Promise 带来的能力是任务管理，常用的方式有

new Promise(...).then(onResolved, onRejected)

任务状态管理
resolve 成功状态，对应 Promise.resolve
reject 失败状态，对应 Promise.reject
error 异常状态， 对应 Promise.reject 或 new Promise().catch(onRejected)
Thenabled机制提供任务方法链
new Promise().then().then().catch()
resolve
处理任务的成功状态

普通方式


async/await 的主要使用
前言
对于回调来讲，Promise 的到来看似只解决了回调场景中的状态处理问题，但是JavaScript中令人头疼不是回调，而是 回调嵌套。同时，Promise的出现，也不能彻底解决回调嵌套的带来的代码维护和可读性的问题。


aysnc/await的使用
async 是 声明 在回调环境函数
await 是 运行 在等待回调结果过程中
Promise 是封装了回调操作的 原子任务


http服务构成
服务容器
这里的服务容器，是整个HTTP服务的基石，跟apache和nginx提供的能力是一致的。

建立了通信连接
指定了通信端口
提供了可自定内容服务容器，也就是服务的回调函数的容器


中间件引擎
中间件原理
洋葱模型可以看出，中间件的在 await next() 前后的操作，很像数据结构的一种场景——“栈”，先进后出。同时，又有统一上下文管理操作数据。综上所述，可以总结出一下特性。

有统一 context
操作先进后出
有控制先进后出的机制 next
有提前结束机制


引擎实现
通过上一节中的中间件原理，可以看出，单纯用Promise 嵌套可以直接实现中间件流程。虽然可以实现，但是Promise嵌套会产生代码的可读性和可维护性的问题，也带来了中间件扩展问题。

所以需要把Promise 嵌套实现的中间件方式进行高度抽象，达到可以自定义中间件的层数。这时候需要借助前面几章提到的处理 Promise嵌套的神器async/await。

我们先理清楚需要的步骤

中间件队列
处理中间件队列，并将上下文context传进去
中间件的流程控制器next
异常处理
根据上一节分析中间的原理，我们可以抽象出

每一个中间件需要封装一个 Promise
洋葱模型的先进后出操作，对应Promise.resolve的前后操作


普通中间件式HTTP服务实现
前言
用过Express.js和Koa.js的人会发现使用方式很类似，也是基于中间件的理念去实现Web服务。

直接以Express.js回调式的中间件服务比较容易理解。再基于回调式的中间件服务接入Koa.js的中间件引擎去处理回调嵌套的处理。

这一章主要以原生的Node.js实现纯回调的中间件HTTP服务。

必要条件
内置中间件队列
中间件遍历机制
异常处理机制
最简实现


最简Koa.js实现
前言
从上一章可以看到最简单的中间件式HTTP服务的实现，底层是基于回调嵌套去处理中间件队列。
```
  /**
   * 中间件总回调方法
   */
  callback() {
    let that = this;

    if (this.listeners('error').length === 0) {
      this.on('error', this.onerror);
    }

    const handleRequest = (req, res) => {
      let context = that.createContext(req, res);
      this.middleware.forEach((cb, idx) => {
        try {
          cb(context);
        } catch (err) {
          that.onerror(err);
        }

        if (idx + 1 >= this.middleware.length) {
          if (res && typeof res.end === 'function') {
            res.end();
          }
        }
      });
    };
    return handleRequest;
  }
```
但是中间件越多，回调嵌套越深，代码的可读性和可扩展性就很差，所以这时候把回调嵌套转化成 Promise + async/await ，这个时候就转变成最简单的Koa.js实现。

必要条件
通过上下文赋值可代替 res.end()
洋葱模型的中间件机制
```
AOP 面向切面编程
什么是AOP?
什么是AOP？中文意思是面向切面编程，听起来感觉很模糊。先举个生产的例子。

农场的水果包装流水线一开始只有 采摘 - 清洗 - 贴标签
example

为了提高销量，想加上两道工序 分类 和 包装 但又不能干扰原有的流程，同时如果没增加收益可以随时撤销新增工序。
example

最后在流水线的中的空隙插上两个工人去处理，形成采摘 - 分类 - 清洗 - 包装 - 贴标签 的新流程，而且工人可以随时撤回。
回到什么是AOP？就是在现有代码程序中，在程序生命周期或者横向流程中 加入/减去 一个或多个功能，不影响原有功能。

Koa.js 的切面
切面由中间件机制实现
一个中间件一般有两个切面
遵循先进后出的切面执行顺序，类似入栈出栈的顺序
example
```
```
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
```
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
```
Koa.js 中间件的分类，在我的理解，可以分成以下两种类型。
```
狭义中间件
广义中间件
狭义中间件
狭义中间件特点：

中间件内操作请求 request
中间件内操作响应 response
中间件内操作上下文 context
大多数直接被 app.use() 加载
举个栗子 例如 中间件koa-static主要是靠拦截请求和响应，加载静态资源，中间件koa-bodyparser主要是拦截请求后解析出HTTP请求体重的POST数据，再挂载到ctx上。
```
```
广义中间件
广义中间件特点

不直接提供中间件
通过间接方式提供了中间件或者子中间件
间接被 app.use() 加载
其他方式接入Koa切面
举个例子 例如中间koa-router 是先注册路由后形成多个子中间件，后面再封装成一个父中间件提供给app.use()加载，让所有子中间件加载到Koa.js的请求洋葱模型中。
```
```
狭义中间件
前言
狭义中间件的要素常见要素如下所示。

一切皆中间件
中间件内操作请求 request
请求拦截
中间件内操作响应 response
响应拦截
中间件内操作上下文 context
直接上下文代理，初始化实例时候挂载代理在app.context上
请求过程上下文代理，请求时候挂载代理在ctx上
大部分直接被 app.use() 加载
注意: 初始化实例挂载代理context不被app.use()
```
```
context挂载代理
请求代理注入

直接被app.use
请求时候才有注入
每次请求的注入都不同
初始化实例（应用）代理注入

直接注入到app.context
初始化应用的时候才注入
只注入一次，每次请求都可以使用
```
```
koa-logger 实现
前言
狭义中间件，请求/拦截 最显著的特征是

直接被app.use()
拦截请求
操作响应
最简单的场景是 Koa.js 官方支持传输静态文件中间件的实现koa-logger。

本节主要以官方的 koa-logger 中间件为参考，实现了一个最简单的koa-logger 实现，方便原理讲解和后续二次自定义优化开发。

实现步骤
step 01 拦截请求，打印请求URL
step 02 操作响应，打印响应URL
```

```
koa-send 实现
前言
狭义中间件，请求/拦截 最显著的特征是

直接被app.use()
拦截请求
操作响应
最典型的场景是 Koa.js 官方支持传输静态文件中间件的实现koa-send。

主要实现场景流程是

拦截请求，判断该请求是否请求本地静态资源文件
操作响应，返回对应的静态文件文本内容或出错提示
本节主要以官方的 koa-send 中间件为参考，实现了一个最简单的koa-end 实现，方便原理讲解和后续二次自定义优化开发。

实现步骤
step 01 配置静态资源绝对目录地址
step 02 判断是否支持隐藏文件
step 03 获取文件或者目录信息
step 04 判断是否需要压缩
step 05 设置HTTP头信息
step 06 静态文件读取
```


```
koa-static 实现
前言
狭义中间件 请求/拦截，最典型的场景是 Koa.js 传输静态文件中间件的实现koa-send。Koa.js 官方对 koa-send 进行二次封装，推出了koa-static 中间件，目标是用于做静态服务器或者项目静态资源管理。

本节主要以官方的 koa-static 中间件为参考，基于上一节实现的最简单koa-send, 实现了一个最简单的koa-static 中间件，方便原理讲解和后续二次自定义优化开发。

实现步骤
step 01 配置静态资源绝对目录地址
step 02 判断是否支持等待其他请求
step 03 判断是否为 GET 和 HEAD 类型的请求
step 04 通过koa-send 中间件读取和返回静态文件
```

```

view实现
初始化实例代理上下文context 实现

前言
狭义中间件区别于请求/响应拦截的另一种方式是上下文context代理。

上下文context代理分成两种

实例代理上下文context
请求过程代理上下文context
这里先将第一种代理方式——实例代理上下文context实现步骤，实例代理的比较有代表性的中间件是官方提 koa-ejs 中间件，把渲染的方法挂载在Koa实例app的app.context 属性中。

常见化实例代理上下文context实现步骤

初始化一个Koa实例 let app = new Koa()
将需要的属性或者方法 demo 挂载在 app.context 上，app.context.demo
在app.use()中间件直接使用 ctx.demo 方法或属性
这里我们实现最简单的模板渲染中间件 view，模仿koa-ejs的基本能力。

实现步骤
view 的实现步骤

step 01 初始化一个Koa实例 let app = new Koa()
step 02 将需要的属性或者方法 view 挂载在 app.context 上，app.context.view
step 03 在app.use()中间件直接使用 ctx.view 方法或属性渲染模板
```

```
jsonp 实现
初始化时候，实例代理上下文context实现

前言
实例代理的还有另外比较有代表性的中间件是官方提供 koa-safe-jsonp 中间件，把jsonp的方法挂载在Koa实例app的app.context 属性中。

常见实例代理上下文context实现步骤

初始化一个Koa实例 let app = new Koa()
将需要的属性或者方法 demo 挂载在 app.context 上，app.context.demo
在app.use()中间件直接使用 ctx.demo 方法或属性
这里我们实现最简单的模板渲染中间件 jsonp，模仿koa-safe-jsonp的基本能力。

实现步骤
jsonp 的实现步骤

step 01 初始化一个Koa实例 let app = new Koa()
step 02 将需要的属性或者方法 jsonp 挂载在 app.context 上，app.context.jsonp
step 03 在app.use()中间件直接使用 ctx.jsonp 方法或属性渲染模板
step 04 当前请求响应要返回jsonp数据时候 ctx.body = ctx.jsonp(result)
```


```
koa-bodyparser 实现
请求代理上下文context实现

前言
狭义中间件的上下文代理，除了在实例化 let app = new Koa() 的时候将属性或者方法挂载到app.context 中，供后续中间件使用。另外一种方式是在请求过程中在顶端中间件(一般在第一个中间件)使用，把数据或者方法挂载代理到ctx 供下游中间件获取和使用。

这里 请求代理上下文实现 最代表性是官方提供的koa-bodyparser 中间件，这里基于官方原版用最简单的方式实现koa-bodyparser最简单功能。

常见请求代理上下文context实现过程

请求代理ctx
直接app.use()
在请求过程中过载方法或者数据到上下文ctx
一般在大部分中间件前加载，供下游中间件获取挂载的数据或方法
实现步骤
step 01 app.use()在中间件最顶端
step 02 拦截post请求
step 03 等待解析表单信息
step 04 把表单信息代理到ctx.request.body上
step 05 下游中间件都可以在ctx.request.body中获取表单数据
```

```
koa-router 实现
前言
广义中间件，间接中间件方式

不直接提供中间件
通过间接方式提供了中间件，最常见的是间接中间件和子中间件
间接被 app.use() 加载
其他方式接入Koa切面
这里 广义中间件，间接中间件方式实现 最代表性是第三方实现的 koa-router 中间件，这里基于第三方中间件 koa-router 用最简单的方式实现 koa-router 最简单功能。

实现步骤
初始化路由实例
注册路由请求信息缓存到实例中
请求类型
请求path
对应的请求后操作
注册的路由操作就是子中间件
路由实例输出父中间件
返回一个父中间件
中间件里对每次请求进行遍历匹配缓存中注册的路由操作
匹配上请求类型，路径就执行对应路由子中间件
app.use()路由实例返回的父中间件
```

```

koa-mount 实现
前言
广义中间件，间接中间件方式实现，还有一个官方的中间件 koa-mount ，让多个Koa.js子应用合并成一个父应用，用请求的前缀区分子应用。这里基于第三方中间件 koa-mount 用最简单的方式实现 koa-mount 最简单功能。

实现步骤
使用过程
初始化子应用Koa.js实例
初始化父应用Koa.js实例
处理子应用middleware属性，将所有中间件用koa-compose封装成一个子应用中间件
用父应用app.use()加载处理后的子应用中间件
mount实现过程
输入子应用的前缀和应用实例
获取子应用的中间件集合middleware属性
用koa-compose封装子应用的中间件集合
返回一个父中间件
父中间件里执行compose封装后的子中间件集合
执行前把请求path子应用前缀去掉
执行后把请求path子应用前缀还原到原始请求path
父应用app.use子应用封装后父中间件，(compose封装的子应用所有中间件)
```