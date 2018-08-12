cd 到 koademo 下

npm install 

js是单线程的，

进程 ：

线程：

中间件开发大全

https://www.cnblogs.com/lhb25/p/nodejs-middlewave-modules.html

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
综上所述，用Koa.js想实现大部分Web功能的话，就需要整合相关功能的中间件。
换句话说，Koa.js 说就是中间件的大容器，
任何Web所需的能力通过中间件来实现。

Koa.js 中间件的分类，在我的理解，可以分成以下两种类型。

狭义中间件
广义中间件
狭义中间件
狭义中间件特点：

中间件内操作请求 request
中间件内操作响应 response
中间件内操作上下文 context
大多数直接被 app.use() 加载
举个栗子 例如 中间件koa-static主要是靠拦截请求和响应，加载静态资源，
中间件koa-bodyparser主要是拦截请求后解析出HTTP请求体重的POST数据，
再挂载到ctx上。

广义中间件
广义中间件特点

不直接提供中间件
通过间接方式提供了中间件或者子中间件
间接被 app.use() 加载
其他方式接入Koa切面
举个例子 例如中间koa-router 是先注册路由后形成多个子中间件，后面再封装成一个父中间件提供给app.use()加载，
让所有子中间件加载到Koa.js的请求洋葱模型中。
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
广义中间件
前言
不直接提供中间件
通过间接方式提供了中间件，最常见的是间接中间件和子中间件
间接被 app.use() 加载
其他方式接入Koa切面
```
```
子中间件
子中间件是广义中间件的一个最有代表场景，主要的特点有

初始化中间件时，内置子中间件列表
子中间件列表添加子中间件元素
子中间件列表封装成间接中间件，让后被app.use()加载
```
阅读目录
```
一、koa2
二、项目构建
三、首先是写法
1.以前是.then方法里的各种callback
2.现在可以用 async await
四、Route 路由
五、Middleware 中间件
六、Logs 日志
七、File 文件系统
八、mongodb crud 数据库
九、1.1 安装koa-generator
十、1.2 使用koa-generator生成koa2项目
undefined、1.3 启动项目
undefined、1.4 关于koa2
1.1.4.1 中间件的执行顺序
2.1.4.2 async await语法支持
3.1.4.3 Context
undefined、2.1 当我们输入npm start的时候都干了些什么
undefined、2.2 npm scripts
undefined、2.3 配置环境
undefined、2.4 配置文件
undefined、3.1 log4js
undefined、3.2 log4js 配置
undefined、3.3 初始化logs文件目录
undefined、4.1 建立一个API接口
undefined、4.2 为API接口配置路由
undefined、4.3 格式化输出
undefined、4.4 对URL进行过滤
undefined、4.5 API异常处理
undefined、5.1 mocha
1.安装mocha
2.使用mocha
3.测试环境
4.常用的参数
undefined、5.2 chai
1.安装chai
2.使用chai
undefined、5.3 supertest
1.安装supertest
2.使用supertest
返回顶部
koa2
https://koa.bootcss.com/

为啥入坑，Express 原班人马打造 更小、更健壮、更富有表现力

一直很想研究下koa2，最近得空，加上自己挤出来的时间，终于入坑了koa2。由于之前有过一些express经验，开发过一些后端的东西。所以以为koa还是很好上手的，但是用起来发现懵逼了，虽然大致结构上差不多，但是一些方法的细节还是有些差别的。重大的差别就是response, 另外采用了es6语法，在写法上更加的飘逸。为了避免刚入坑的小伙伴爬不出来，因此整理此文。

返回顶部
项目构建
先介绍下目录结构，如下

.
├── README.md 项目描述
├── app  业务侧代码
│   ├── controller 与路由关联的api方法
│   └── modal 数据模型
├── app.js 入口文件
├── bin nodemon
│   ├── run  nodemon 的入口文件
│   └── www
├── config 配置文件
│   ├── dbConfig.js 数据库配置
│   ├── logConfig.js 日志配置 
│   └── serverConfig.js 服务配置
├── logs  日志目录
│   ├── error 错误日志
│   └── response 普通响应日志 (还可以继续拆分，系统日志，业务日志)
├── middleware  中间件
│   └── loggers.js  日志中间件
├── public
│   └── stylesheets 公用文件
├── routes  路由
│   ├── allRoute.js 总路由配置
│   ├── files.js 各个模块路由配置
│   ├── index.js
│   └── users.js
├── uploads 上传文件夹
│   └── 2017-8-29
├── utils 公用方法
│   ├── logUtil.js 
│   └── mkdir.js
├── views 页面层
│   ├── error.jade
│   ├── index.jade
│   └── layout.jade
└── package.json


tree 目录生成命令

tree -L 3 -I "node_modules"

brew install tree  ||  apt-get install tree
tree -d 只显示文件夹；
tree -L n 显示项目的层级。n表示层级数。比如想要显示项目三层结构，可以用tree -l 3；
tree -I pattern 用于过滤不想要显示的文件或者文件夹。比如你想要过滤项目中的node_modules文件夹，可以使用tree -I "node_modules"；
tree > tree.md 将项目结构输出到tree.md这个文件。
返回顶部
首先是写法
之前用express的时候，用的是es5的语法规范 koa2用采用了es6，7的新特性，尽情的使用let吧 nodemon babelrc的福音，自动转码，不用配置.babelrc， 也不需要再装一些列bable转码了。

写异步

以前是.then方法里的各种callback
exports.getUserList = function() { 
	user.find({
	 _id: id,
	}, arr, function(e, numberAffected, raw) {
	  if(e){
		  respondata={
		    "code":"9900",
		    "message":"error"
		  };
	  }else{
		  respondata={
		    "code":"0000",
		    "message":"success"
		  };
	  }
	});
}
现在可以用 async await
exports.getUserList = async (ctx, next) => {
    try {
        let list = await user.find();
        let respon = {
            code: '0000',
            message: 'success',
            data: list
        }
        return respon;
    } catch (err) {
        let respon = {
            code: '9999',
            message: 'error',
            data: err
        }
        return respon;
    }
}
因为后端的很多操作方法，比如文件，数据库，都是异步的，所以这种将异步写法变为同步写法，是代码的可读性大大提高。

返回顶部
Route 路由
koa-route 采用的是restful设计模式，可以参考阮一峰老师的《RESTful API 设计指南》 www.ruanyifeng.com/blog/2014/0…

路由的模块化 路由规则是域名+模块+方法

例如：localhost:8080/users/getUser

<allroute.js>

const router = require('koa-router')();
const index = require('./index');
const users = require('./users');
const files = require('./files');

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/files', files.routes(), files.allowedMethods());

module.exports = router;


<users.js>
const router = require('koa-router')();
import {getUserList, register, removeUser} from '../app/controller/user'

router.get('/', function (ctx, next) {
  ctx.body = 'this a users response!';
});
router.get('/getUser', async (ctx, next) => {
  ctx.body = await getUserList(ctx, next);
});
router.post('/register', async (ctx, next) => {
  console.log(ctx.request.body);
  let reqBody = ctx.request.body;
  ctx.body = await register(reqBody);
});
router.del('/removeUser', async (ctx, next) => {
  console.log(ctx.request.body);
  let reqBody = ctx.request.body;
  ctx.body = await removeUser(reqBody);
});
module.exports = router;
reseful的路由，如果你的请求方式不是get | post | del,或者与其不匹配，统一返回404 not found

返回顶部
Middleware 中间件
中间件就是类似于一个过滤器的东西，在客户端和应用程序之间的一个处理请求和响应的的方法。

.middleware1 {
  // (1) do some stuff
  .middleware2 {
    // (2) do some other stuff
    .middleware3 {
      // (3) NO next yield !
      // this.body = 'hello world'
    }
    // (4) do some other stuff later
  }
  // (5) do some stuff lastest and return
}
中间件的执行很像一个洋葱，但并不是一层一层的执行，而是以next为分界，先执行本层中next以前的部分，当下一层中间件执行完后，再执行本层next以后的部分。



let koa = require('koa');
let app = new koa();

app.use((ctx, next) => {
  console.log(1)
  next(); // next不写会报错
  console.log(5)
});

app.use((ctx, next) => {
  console.log(2)
  next();
  console.log(4)
});

app.use((ctx, next) => {
  console.log(3)
  ctx.body = 'Hello World';
});

app.listen(3000);
// 打印出1、2、3、4、5
上述简单的应用打印出1、2、3、4、5，这个其实就是koa中间件控制的核心，一个洋葱结构，从上往下一层一层进来，再从下往上一层一层回去，乍一看很复杂，为什么不直接一层一层下来就结束呢，就像express/connect一样，我们就只要next就去下一个中间件，干嘛还要回来？

其实这就是为了解决复杂应用中频繁的回调而设计的级联代码，并不直接把控制权完全交给下一个中间件，而是碰到next去下一个中间件，等下面都执行完了，还会执行next以下的内容

解决频繁的回调，这又有什么依据呢？举个简单的例子，假如我们需要知道穿过中间件的时间，我们使用koa可以轻松地写出来，但是使用express呢，可以去看下express reponse-time的源码，它就只能通过监听header被write out的时候然后触发回调函数计算时间，但是koa完全不用写callback，我们只需要在next后面加几行代码就解决了（直接使用.then()都可以）

返回顶部
Logs 日志
log4js接入及使用方法

let log4js = require('log4js');

let logConfig = require('../config/logConfig');

//加载配置文件
log4js.configure(logConfig);

let logUtil = {};

let errorLogger = log4js.getLogger('error'); //categories的元素
let resLogger = log4js.getLogger('response');

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};



config : {
    "appenders":{
        error: {
            "category":"errorLogger",             //logger名称
            "type": "dateFile",                   //日志类型
            "filename": errorLogPath,             //日志输出位置
            "alwaysIncludePattern":true,          //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
            "path": errorPath  
        },
        response: {
            "category":"resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "alwaysIncludePattern":true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path": responsePath,
        }
    },
    "categories" : { 
        error: { appenders: ['error'], level: 'error' },
        response: { appenders: ['response'], level: 'info' },
        default: { appenders: ['response'], level: 'info' },
    }
}
返回顶部
File 文件系统
nodejs 文件 I/O 是对标准 POSIX 函数的简单封装。 通过 require('fs') 使用该模块。 所有的方法都有异步和同步的形式。

异步方法的最后一个参数都是一个回调函数。 传给回调函数的参数取决于具体方法，但回调函数的第一个参数都会保留给异常。 如果操作成功完成，则第一个参数会是 null 或 undefined。

当使用同步方法时，任何异常都会被立即抛出。 可以使用 try/catch 来处理异常，或让异常向上冒泡。

比如要做一个图片上传和图片展示的功能，需要用到以下几个方法

existsSync 检测文件是否存在（同步方法）
mkdirsSync 创建目录（同步方法）
readFileSync 读取文件
createWriteStream 创建一个写入流
createReadStream 创建一个读取流
unlinkSync 文件删除（同步方法）
文件上传步骤

拿到上传的file对象
规定好文件存放的路径
创建目标路径的写入流和file.path(缓存路径)的读入流
以读入流为基础放入写入流中
删除缓存路径的文件
数据库记录
file = ctx.request.body.files 
targetInfo = getFileInfo(type);

tmpPath = file.path;
type = file.type;
    
targetInfo = getFileInfo(type);

// targetInfo 包含 {targetName 文件名称,targetPaths 全路径目标目录, resultPath 加上文件名的目标目录, relativePath 相对路径目标目录}

mkdirs.mkdirsSync(targetInfo.targetPaths); // 目录
stream = fs.createWriteStream(targetInfo.resultPath);//创建一个可写流  
fs.createReadStream(tmpPath).pipe(stream);
unlinkStatus = fs.unlinkSync(tmpPath);
获取文件 通过readFileSync 拿到Buffer形式的文件

获取文件的路径
filepath = files.find({_id: id}); //通过查询数据库拿到
ctx.body = fs.readFileSync(filepath);
ctx.res.writeHead(200, {'Content-Type': 'image/png'});
返回顶部
mongodb crud 数据库
connect 数据库连接

let dbName = "nodeapi";
let dbHost = "mongodb://localhost/";
let mongoose = require("mongoose");
exports.connect = function(request, response) {
    mongoose.connect(dbHost + dbName, { useMongoClient: true }); // useMongoClient防止报错
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
      console.log('connet success!');
    });
}
mongoose.Schema 字段对象模式

增删改查 modal

let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let FilesSchema = new Schema({
    fileName: String,
    filePath: String,
    content: String,
	createTime: {
        type: Date,
        dafault: Date.now()
    },
	updateTime: {
        type: Date,
        dafault: Date.now()
    },
})

FilesSchema.pre('save', function(next) {
    if (this.isNew) {
      this.createTime = this.updateTime = Date.now()
    }
    else {
      this.updateTime = Date.now()
    }
    next()
})
class Files{
    constructor() {
          this.files = mongoose.model("files", FilesSchema);
    }
    find(dataArr={}) {
        const self = this;
        return new Promise(function (resolve, reject){
            self.files.find(dataArr, function(e, docs) {
                if(e){
                    console.log('e:',e);
                    reject(e);
                }else{
                    resolve(docs);
                }
            })
        })
    }
    create(dataArr) {
        const self = this;
        return new Promise(function (resolve, reject){
            let user = new self.files({
                fileName: dataArr.fileName,
                filePath: dataArr.filePath,
                content: dataArr.content,
            });
            user.save(function(e, data, numberAffected) {
                // if (e) response.send(e.message);
                if(e){
                    reject(e);
                }else{
                    resolve(data);
                }
            });
        })
    }
    delete(dataArr) {
        const self = this;
        return new Promise(function (resolve, reject){
            self.files.remove({
                _id: dataArr.id
            }, function(e, data) {
                if(e){
                    reject(e);
                }else{
                    resolve(data);
                }
            });
        })
    }
}

let files = new Files()
export {files}
以模块的形式进行封装，可以更方便外层调用

async 异步写操作数据库

import {files} from '../modal/files'
readFile =  async (id) => {
    try {
        let list = await files.find({_id: id});
        console.log(list)
        if(list && list.length > 0) {
            return fs.readFileSync(list[0].content);   
        } else {
            return errdata(null,'9999', 'can not find file')
        }
    } catch (err) {
        return errdata(err);
    }
}
koa2学习地址参考

github.com/guo-yu/koa-…

出于兴趣最近开始研究koa2，由于之前有过一些express经验，以为koa还是很好上手的，但是用起来发现还是有些地方容易懵逼，因此整理此文，希望能够帮助到一些新人。

如果你不懂javascript，建议你先去撸一遍红宝书javascript高级程序设计
如果你不熟悉ES6，建议你先去撸一遍阮一峰老师的ECMAScript 6入门

因为我也是新人，我只是整理了我的学习经历，如何填平踩到的坑。

如果有读者发现我有写错的地方希望你能及时留言给我，别让我误导了其他新手。

本文的系统环境Mac OS
编译器 VScode

1 构建项目
想使用koa，我们肯定首先想到去官网看看，没准有个guide之类的能够轻松入门，可是koa官网跟koa本身一样简洁。

如果要我一点点搭建环境的话，感觉好麻烦，所以先去找了找有没有项目生成器，然后就发现了狼叔-桑世龙写的koa-generator。

返回顶部
1.1 安装koa-generator
在终端输入：

$ npm install -g koa-generator
返回顶部
1.2 使用koa-generator生成koa2项目
在你的工作目录下，输入：

$ koa2 HelloKoa2
成功创建项目后，进入项目目录，并执行<code>npm install</code>命令

$ cd HelloKoa2 
$ npm install
返回顶部
1.3 启动项目
在终端输入：

$ npm start
项目启动后，默认端口号是3000，在浏览器中运行可以得到下图的效果说明运行成功。


 

 
在此再次感谢狼叔-桑世龙。

当前项目的文件目录如下图


 

FileTree
返回顶部
1.4 关于koa2
1.4.1 中间件的执行顺序
koa的中间件是由generator组成的，这决定了中间件的执行顺序。
Express的中间件是顺序执行，从第一个中间件执行到最后一个中间件，发出响应。

 

 
koa是从第一个中间件开始执行，遇到<code>next</code>进入下一个中间件，一直执行到最后一个中间件，在逆序，执行上一个中间件<code>next</code>之后的代码，一直到第一个中间件执行结束才发出响应。

 

 
1.4.2 async await语法支持
koa2增加了<code>async</code> <code>await</code>语法的支持.

原来koa的中间件写法

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});
koa2中的写法

app.use(async (next) => {
  var start = new Date;
  await next();
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});
koa声明说要在v3版本中取消对generator中间件的支持，所以为了长久考虑还是用async语法的好。
如果想要继续使用<code>function*</code>语法，可以使用 <code>koa-convert</code> 这个中间件进行转换。这也是你看到项目中会有下面代码的原因

const convert = require('koa-convert');

app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
1.4.3 Context
Context封装了node中的request和response。

koa@1.x使用this引用Context对象：

app.use(function *(){
  this.body = 'Hello World';
});
koa@2.x中使用ctx来访问Context对象：

app.use(async (ctx, next) => {
  await next();
  ctx.body = 'Hello World';
});
上面代码中的<code>ctx.body = 'Hello World'</code>这行代码表示设置response.body的值为'Hello World'。

如果你看文档就有可能懵逼，那么我发送post请求的参数应该怎么获取呢?
貌似ctx不能直接获取request的body，想要获取post请求中的参数要使用<code>ctx.request.body</code>。

如需查看项目代码 –> 代码地址:

https://github.com/tough1985/hello-koa2
选择Tag -> step1

2 项目配置
这里的配置指的是运行环境的配置，比如我们在开发阶段使用本地的数据库，测试要使用测试库，发布上线时候使用线上的库，也会有不同的端口号。

返回顶部
2.1 当我们输入npm start的时候都干了些什么
在package.json文件中

"scripts": {
    "start": "./node_modules/.bin/nodemon bin/run",
    "koa": "./node_modules/.bin/runkoa bin/www",
    "pm2": "pm2 start bin/run ",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
可以看到这部分内容，当我们在终端输入：

$ npm start
在就会运行package.json中scripts对象对应的start字段后面的内容，相当于你在终端输入：

$ ./node_modules/.bin/nodemon bin/run
nodemon插件的作用是在你启动了服务之后，修改文件可以自动重启服务。
关于nodemon的更多内容 --> nodemon

如果不考虑自动重启功能，其实这句代码相当于执行了<code>node bin/run</code>
我们可以看到项目的bin目录下，有一个run文件，代码如下：

#!/usr/bin/env node

var current_path = process.cwd();

require('runkoa')(current_path + '/bin/www' )
这里引入了一个runkoa，这个组件是狼叔写的koa2对babel环境依赖的一个封装插件。

关于runkoa相关内容说明 --> runkoa。这里我们最终会执行bin目录下的www文件来启动服务。

返回顶部
2.2 npm scripts
我们在scripts对象中添加一段代码"start_koa": "bin/run"，修改后scripts对象的内容如下：

"scripts": {
    "start": "./node_modules/.bin/nodemon bin/run",
    "koa": "./node_modules/.bin/runkoa bin/www",
    "pm2": "pm2 start bin/run ",
    "test": "echo \"Error: no test specified\" && exit 1",
    "start_koa": "bin/run"
  }
那么既然输入<code>npm start</code>执行start后面的脚本，聪明的你一定会想：是不是我输入<code>npm start_koa</code>就可以执行start_koa后面相关的代码了呢？
不管你是怎么想的，反正我当时就想的这么天真。
事实上我们输入<code>npm start_koa</code>之后，终端会提示npm没有相关的命令。
那么在scripts中的start_koa命令要怎么使用呢，其实要加一个run命令才能执行，在终端输入：

$ npm run start_koa
可以看到服务正常运行了。

在npm中，有四个常用的缩写

npm start是npm run start
npm stop是npm run stop的简写
npm test是npm run test的简写
npm restart是npm run stop && npm run restart && npm run start的简写

其他的都要使用<code>npm run</code>来执行了。

推荐读一遍阮一峰老师写的npm scripts 使用指南，很有帮助。

返回顶部
2.3 配置环境
关于配置环境常用的有development、test、production、debug。
可以使用node提供的<code>process.env.NODE_ENV</code>来设置。

在启动服务的时候可以对NODE_ENV进行赋值，例如：

$ NODE_ENV=test npm start 
然后我们可以在bin/www文件中输出一下，看看是否配置成功，添加如下代码：

console.log("process.env.NODE_ENV=" + process.env.NODE_ENV);
然后在终端输入

$ NODE_ENV=test npm start 
可以看到终端打印：

process.env.NODE_ENV=test
我们可以在scripts对象中将环境配置好，例如我们将start和test分别设置development和test环境，代码如下：

"scripts": {
    "start": "NODE_ENV=development ./node_modules/.bin/nodemon bin/run",
    "koa": "./node_modules/.bin/runkoa bin/www",
    "pm2": "pm2 start bin/run ",
    "test": "NODE_ENV=test echo \"Error: no test specified\" && exit 1",
    "start_koa": "bin/run"
},
可以在终端分别输入<code>npm start</code>和<code>npm test</code>来测试环境配置是否生效。

由于并没有测试内容，现在的test脚本会退出，后面我们在详谈koa的测试。

返回顶部
2.4 配置文件
为了能够根据不同的运行环境加载不同的配置内容，我们需要添加一些配置文件。
首先在项目根目录下添加config目录，在config目录下添加index.js、test.js、development.js三个文件，内容如下。

development.js

/**
 * 开发环境的配置内容
 */

module.exports = {
    env: 'development', //环境名称
    port: 3001,         //服务端口号
    mongodb_url: '',    //数据库地址
    redis_url:'',       //redis地址
    redis_port: ''      //redis端口号
}
test.js

/**
 * 测试环境的配置内容
 */

module.exports = {
    env: 'test',        //环境名称
    port: 3002,         //服务端口号
    mongodb_url: '',    //数据库地址
    redis_url:'',       //redis地址
    redis_port: ''      //redis端口号
}
index.js

var development_env = require('./development');
var test_env = require('./test');

//根据不同的NODE_ENV，输出不同的配置对象，默认输出development的配置对象
module.exports = {
    development: development_env,
    test: test_env
}[process.env.NODE_ENV || 'development']
代码应该都没什么可解释的，然后我们再来编辑bin/www文件。

bin/www添加如下代码

//引入配置文件
var config = require('../config');

// 将端口号设置为配置文件的端口号，默认值为3000
var port = normalizePort(config.port || '3000');
// 打印输出端口号
console.log('port = ' + config.port);
测试效果，在终端输入<code>npm start</code>，可以看到

process.env.NODE_ENV=development
port = 3001
到浏览器中访问http://127.0.0.1:3001，可以看到原来的输入内容，说明配置文件已经生效。

如需查看项目代码 –> 代码地址:

https://github.com/tough1985/hello-koa2
选择Tag -> step2

3 日志
狼叔的koa-generator已经添加了koa-logger，在app.js文件你可以找到这样的代码：

const logger = require('koa-logger');
...
...
app.use(convert(logger()));
koa-logger是tj大神写的koa开发时替换console.log输出的一个插件。

如果你需要按照时间或者按照文件大小，本地输出log文件的话，建议还是采用log4js-node。

返回顶部
3.1 log4js
log4js提供了多个日志等级分类，同时也能替换console.log输出，另外他还可以按照文件大小或者日期来生成本地日志文件，还可以使用邮件等形式发送日志。

我们在这演示用info和error两种日志等级分别记录响应日志和错误日志。

返回顶部
3.2 log4js 配置
在config目录下创建一个log_config.js文件，内容如下：

var path = require('path');

//错误日志输出完整路径
var errorLogPath = path.resolve(__dirname, "../logs/error/error");
 
//响应日志输出完整路径
var responseLogPath = path.resolve(__dirname, "../logs/response/response");

module.exports = {
    "appenders":
    [
        //错误日志
        {
            "category":"errorLogger",             //logger名称
            "type": "dateFile",                   //日志类型
            "filename": errorLogPath,             //日志输出位置
            "alwaysIncludePattern":true,          //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log"       //后缀，每小时创建一个新的日志文件
        },
        //响应日志
        {
            "category":"resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "alwaysIncludePattern":true,
            "pattern": "-yyyy-MM-dd-hh.log"
        }
    ],
    "levels":                                     //设置logger名称对应的的日志等级
    {
        "errorLogger":"ERROR",
        "resLogger":"ALL"
    }
}
然后创建一个utils目录，添加log_util.js文件，内容如下：

var log4js = require('log4js');

var log_config = require('../config/log_config');

//加载配置文件
log4js.configure(log_config);

var logUtil = {};

var errorLogger = log4js.getLogger('errorLogger');
var resLogger = log4js.getLogger('resLogger');

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        errorLogger.error(formatError(ctx, error, resTime));
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.info(formatRes(ctx, resTime));
    }
};

//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = new String();

    //响应日志开始
    logText += "\n" + "*************** response log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** response log end ***************" + "\n";

    return logText;

}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {

    var logText = new String();

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n";

    return logText;
}

module.exports = logUtil;

接下来修改app.js 文件中的logger部分。

//log工具
const logUtil = require('./utils/log_util');


// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();

    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);

  } catch (error) {
    
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});
在这将<code>await next();</code>放到了一个<code>try catch</code>里面，这样后面的中间件有异常都可以在这集中处理。

比如你会将一些API异常作为正常值返回给客户端，就可以在这集中进行处理。然后后面的中间件只要<code>throw</code>自定义的API异常就可以了。

在启动服务之前不要忘记先安装log4js插件：

$ npm install log4js --save
启动服务

$ npm start
这时候会启动失败，控制台会输出没有文件或文件目录。原因是我们在配置里面虽然配置了文件目录，但是并没有创建相关目录，解决的办法是手动创建相关目录，或者在服务启动的时候，确认一下目录是否存在，如果不存在则创建相关目录。

返回顶部
3.3 初始化logs文件目录
先来修改一下log_config.js文件，让后面的创建过程更舒适。

修改后的代码：

var path = require('path');

//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs')

//错误日志目录
var errorPath = "/error";
//错误日志文件名
var errorFileName = "error";
//错误日志输出完整路径
var errorLogPath = baseLogPath + errorPath + "/" + errorFileName;
// var errorLogPath = path.resolve(__dirname, "../logs/error/error");
 

//响应日志目录
var responsePath = "/response";
//响应日志文件名
var responseFileName = "response";
//响应日志输出完整路径
var responseLogPath = baseLogPath + responsePath + "/" + responseFileName;
// var responseLogPath = path.resolve(__dirname, "../logs/response/response");

module.exports = {
    "appenders":
    [
        //错误日志
        {
            "category":"errorLogger",             //logger名称
            "type": "dateFile",                   //日志类型
            "filename": errorLogPath,             //日志输出位置
            "alwaysIncludePattern":true,          //是否总是有后缀名
            "pattern": "-yyyy-MM-dd-hh.log",      //后缀，每小时创建一个新的日志文件
            "path": errorPath                     //自定义属性，错误日志的根目录
        },
        //响应日志
        {
            "category":"resLogger",
            "type": "dateFile",
            "filename": responseLogPath,
            "alwaysIncludePattern":true,
            "pattern": "-yyyy-MM-dd-hh.log",
            "path": responsePath  
        }
    ],
    "levels":                                   //设置logger名称对应的的日志等级
    {
        "errorLogger":"ERROR",
        "resLogger":"ALL"
    },
    "baseLogPath": baseLogPath                  //logs根目录
}
然后打开bin/www文件，添加如下代码：

var fs = require('fs');
var logConfig = require('../config/log_config');

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
var confirmPath = function(pathStr) {

  if(!fs.existsSync(pathStr)){
      fs.mkdirSync(pathStr);
      console.log('createPath: ' + pathStr);
    }
}

/**
 * 初始化log相关目录
 */
var initLogPath = function(){
  //创建log的根目录'logs'
  if(logConfig.baseLogPath){
    confirmPath(logConfig.baseLogPath)
    //根据不同的logType创建不同的文件目录
    for(var i = 0, len = logConfig.appenders.length; i < len; i++){
      if(logConfig.appenders[i].path){
        confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path);
      }
    }
  }
}

initLogPath();
这样每次启动服务的时候，都会去确认一下相关的文件目录是否存在，如果不存在就创建相关的文件目录。

现在在来启动服务。在浏览器访问，可以看到项目中多了logs目录以及相关子目录，并产生了日子文件。

 

 
内容如下：

[2016-10-31 12:58:48.832] [INFO] resLogger - 
*************** response log start ***************
request method: GET
request originalUrl:  /
request client ip:  ::ffff:127.0.0.1
request query:  {}
response time: 418
response status: 200
response body: 
"<!DOCTYPE html><html><head><title>koa2 title</title><link rel=\"stylesheet\" href=\"/stylesheets/style.css\"></head><body><h1>koa2 title</h1><p>Welcome to koa2 title</p></body></html>"
*************** response log end ***************
可以根据自己的需求，定制相关的日志格式。

另外关于配置文件的选项可以参考log4js-node Appenders说明。

如需查看项目代码 –> 代码地址:

https://github.com/tough1985/hello-koa2
选择Tag -> step3

4 格式化输出
假设我们现在开发的是一个API服务接口，会有一个统一的响应格式，同时也希望发生API错误时统一错误格式。

返回顶部
4.1 建立一个API接口
为当前的服务添加两个接口，一个getUser一个registerUser。

先在当前项目下创建一个app/controllers目录，在该目录下添加一个user_controller.js文件。
 

 

代码如下：
 

//获取用户
exports.getUser = async (ctx, next) => {
    ctx.body = {
        username: '阿，希爸',
        age: 30
    }
}

//用户注册
exports.registerUser = async (ctx, next) => {
    console.log('registerUser', ctx.request.body);
}
简单的模拟一下。getUser返回一个user对象，registerUser只是打印输出一下请求参数。

接下来为这两个方法配置路由。

返回顶部
4.2 为API接口配置路由
我们希望服务的地址的组成是这要的

域名 + 端口号 /api/功能类型/具体端口
例如

127.0.0.1:3001/api/users/getUser
先来添加一个api的路由和其他路由分开管理。在routes目录下创建一个api目录，添加user_router.js文件，代码如下：

var router = require('koa-router')();
var user_controller = require('../../app/controllers/user_controller');

router.get('/getUser', user_controller.getUser);
router.post('/registerUser', user_controller.registerUser);

module.exports = router;
这样就完成了getUser和registerUser进行了路由配置，其中getUser是GET方式请求，registerUser是用POST方式请求。

接下来对users这个功能模块进行路由配置，在routes/api目录下添加一个index.js文件，代码如下：

var router = require('koa-router')();
var user_router = require('./user_router');

router.use('/users', user_router.routes(), user_router.allowedMethods());

module.exports = router;

最后对api进行路由配置，在app.js文件中添加如下代码：

const api = require('./routes/api');
......
router.use('/api', api.routes(), api.allowedMethods());
启动服务，在浏览器中访问127.0.0.1:3001/api/users/getUser可以得到如下输出，说明配置成功。

{
  "username": "阿，希爸",
  "age": 30
}
返回顶部
4.3 格式化输出
作为一个API接口，我们可能希望统一返回格式，例如getUser的输出给客户端的返回值是这样的：

{
    "code": 0,
    "message": "成功",
    "data": {
      "username": "阿，希爸",
      "age": 30
    }
}
按照koa的中间件执行顺序，我们要处理数据应该在发送响应之前和路由得到数据之后添加一个中间件。在项目的根目录下添加一个middlewares目录，在该目录下添加response_formatter.js文件，内容如下：

/**
 * 在app.use(router)之前调用
 */
var response_formatter = async (ctx, next) => {
    //先去执行路由
    await next();

    //如果有返回数据，将返回数据添加到data中
    if (ctx.body) {
        ctx.body = {
            code: 0,
            message: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 0,
            message: 'success'
        }
    }
}

module.exports = response_formatter;
然后在app.js中载入。

const response_formatter = require('./middlewares/response_formatter');
...
//添加格式化处理响应结果的中间件，在添加路由之前调用
app.use(response_formatter);

router.use('/', index.routes(), index.allowedMethods());
router.use('/users', users.routes(), users.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());

app.use(router.routes(), router.allowedMethods());
启动服务，在浏览器中访问127.0.0.1:3001/api/users/getUser可以得到如下输出，说明配置成功。

{
  "code": 0,
  "message": "success",
  "data": {
    "username": "阿，希爸",
    "age": 30
  }
}
返回顶部
4.4 对URL进行过滤
为什么一定要在router之前设置？
其实在router之后设置也可以，但是必须在controller里面执行<code>await next()</code>才会调用。也就是说谁需要格式化输出结果自己手动调用。

在router前面设置也有一个问题，就是所有的路由响应输出都会进行格式化输出，这显然也不符合预期，那么我们要对URL进行过滤，通过过滤的才对他进行格式化处理。

重新改造一下response_formatter中间件，让他接受一个参数，然后返回一个async function做为中间件。改造后的代码如下：

/**
 * 在app.use(router)之前调用
 */
var response_formatter = (ctx) => {
    //如果有返回数据，将返回数据添加到data中
    if (ctx.body) {
        ctx.body = {
            code: 0,
            message: 'success',
            data: ctx.body
        }
    } else {
        ctx.body = {
            code: 0,
            message: 'success'
        }
    }
}

var url_filter = function(pattern){

    return async function(ctx, next){
        var reg = new RegExp(pattern);
        //先去执行路由
        await next();
        //通过正则的url进行格式化处理
        if(reg.test(ctx.originalUrl)){
            response_formatter(ctx);
        }
    }
}
module.exports = url_filter;
app.js中对应的代码改为：

//仅对/api开头的url进行格式化处理
app.use(response_formatter('^/api'));
现在访问127.0.0.1:3001/api/users/getUser这样以api开头的地址都会进行格式化处理，而其他的地址则不会。

返回顶部
4.5 API异常处理
要集中处理API异常，首先要创建一个API异常类，在app目录下新建一个error目录，添加ApiError.js文件，代码如下：


/**
 * 自定义Api异常
 */
class ApiError extends Error{
    
    //构造方法
    constructor(error_name， error_code,  error_message){
        super();
        this.name = error_name;
        this.code = error_code;
        this.message = error_message;
    }
}

module.exports = ApiError;
为了让自定义Api异常能够更好的使用，我们创建一个ApiErrorNames.js文件来封装API异常信息，并可以通过API错误名称获取异常信息。代码如下：

/**
 * API错误名称
 */
var ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = "unknowError";
ApiErrorNames.USER_NOT_EXIST = "userNotExist";

/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: -1, message: '未知错误' });
error_map.set(ApiErrorNames.USER_NOT_EXIST, { code: 101, message: '用户不存在' });

//根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = (error_name) => {

    var error_info;

    if (error_name) {
        error_info = error_map.get(error_name);
    }

    //如果没有对应的错误信息，默认'未知错误'
    if (!error_info) {
        error_name = UNKNOW_ERROR;
        error_info = error_map.get(error_name);
    }
    
    return error_info;
}

module.exports = ApiErrorNames;
修改ApiError.js文件，引入ApiErrorNames

ApiError.js

const ApiErrorNames = require('./ApiErrorNames');

/**
 * 自定义Api异常
 */
class ApiError extends Error{
    //构造方法
    constructor(error_name){
        super();
    
        var error_info = ApiErrorNames.getErrorInfo(error_name);

        this.name = error_name;
        this.code = error_info.code;
        this.message = error_info.message;
    }
}

module.exports = ApiError;
在response_formatter.js文件中处理API异常。

先引入ApiError:
<code>var ApiError = require('../app/error/ApiError');</code>

然后修改url_filter

var url_filter = (pattern) => {
    return async (ctx, next) => {
        var reg = new RegExp(pattern);
        try {
            //先去执行路由
            await next();
        } catch (error) {
            //如果异常类型是API异常并且通过正则验证的url，将错误信息添加到响应体中返回。
            if(error instanceof ApiError && reg.test(ctx.originalUrl)){
                ctx.status = 200;
                ctx.body = {
                    code: error.code,
                    message: error.message
                }
            }
            //继续抛，让外层中间件处理日志
            throw error;
        }
        
        //通过正则的url进行格式化处理
        if(reg.test(ctx.originalUrl)){
            response_formatter(ctx);
        }
    }
}
解释一下这段代码

使用<code>try catch</code>包裹<code>await next();</code>，这样后面的中间件抛出的异常都可以在这几集中处理；

<code>throw error;</code>是为了让外层的logger中间件能够处理日志。

为了模拟运行效果，我们修改user_controller.js文件，内容如下：

const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
//获取用户
exports.getUser = async (ctx, next) => {
   //如果id != 1抛出API 异常
    if(ctx.query.id != 1){
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST);
    }
    ctx.body = {
        username: '阿，希爸',
        age: 30
    }
}
启动服务，在浏览器中访问127.0.0.1:3001/api/users/getUser可以得到结果如下：

{
  "code": 101,
  "message": "用户不存在"
}
在浏览器中访问127.0.0.1:3001/api/users/getUser?id=1可以得到结果如下：

{
  "code": 0,
  "message": "success",
  "data": {
    "username": "阿，希爸",
    "age": 30
  }
}
如需查看项目代码 –> 代码地址:

https://github.com/tough1985/hello-koa2
选择Tag -> step4

5 测试
node使用主流的测试框架基本就是mocha和AVA了，这里主要以mocha为基础进行构建相关的测试。

返回顶部
5.1 mocha
安装mocha
在终端输入

$ npm install --save-dev mocha
--dev表示只在development环境下添加依赖。

使用mocha
在项目的根目录下添加test目录，添加一个test.js文件，内容如下：

var assert = require('assert');
/**
 * describe 测试套件 test suite 表示一组相关的测试
 * it 测试用例 test case 表示一个单独的测试
 * assert 断言 表示对结果的预期
 */
describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        })
    })
});
在终端输入：

$ mocha
可以得到输出如下：

  Array
    #indexOf()
      ✓ should return -1 when the value is not present


  1 passing (9ms)
mocha默认运行test目录下的测试文件，测试文件一般与要测试的脚步文件同名以<code>.test.js</code>作为后缀名。例如add.js的测试脚本名字就是add.test.js。

describe表示测试套件，每个测试脚本至少应该包含一个<code>describe</code>。

it表示测试用例。

每个describe可以包含多个describe或多个it。

assert是node提供的断言库。

assert.equal(-1, [1,2,3].indexOf(4));
这句代码的意思是我们期望[1,2,3].indexOf(4)的值应该是-1，如果[1,2,3].indexOf(4)的运行结果是-1，则通过测试，否则不通过。

可以把-1改成-2再试一下。

上面的例子是mocha提供的，mocha官网。

测试环境
之前说过环境配置的内容，我们需要执行测试的时候，加载相关的测试配置该怎么做？

在终端输入

$ NODE_ENV=test mocha
为了避免每次都去输入NODE_ENV=test，可以修改package.json文件中的scripts.test改为：

"test": "NODE_ENV=test mocha",
以后运行测试直接输入npm test就可以了。

常用的参数
mocha在执行时可以携带很多参数，这里介绍几个常用的。

--recursive
mocha默认执行test目录下的测试脚本，但是不会运行test下的子目录中的脚本。
想要执行子目录中的测试脚本，可以在运行时添加--recursive参数。

$ mocha --recursive
--grep
如果你写了很多测试用例，当你添加了一个新的测试，执行之后要在结果里面找半天。这种情况就可以考虑--grep参数。
--grep可以只执行单个测试用例，也就是执行某一个it。比如将刚才的测试修改如下：

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(4));
        })

        it('length', function(){
            assert.equal(3, [1, 2, 3].length);
        })
    })
});
添加了一个length测试用例，想要单独执行这个测试用例就要在终端输入：

$ mocha --grep 'length'
可以看到length用例被单独执行了。

这里有一点需要注意，因为我们配置了npm test，如果直接运行

$ npm test --grep 'length'
这样是不能达到效果的。

要给npm scripts脚本传参需要先输入--然后在输入参数，所以想要执行上面的效果应该输入：

$ npm test -- --grep 'length'
关于mocha就简单的介绍这么多，想要了解更多相关的内容，推荐仔细阅读一遍阮一峰老师写的测试框架 Mocha 实例教程。

返回顶部
5.2 chai
chai是一个断言库。之前的例子中，我们使用的是node提供的断言库，他的功能比较少，基本上只有equal、ok、fail这样简单的功能，很难满足日常的需求。

mocha官方表示你爱用什么断言用什么断言，反正老子都支持。

选择chai是因为他对断言的几种语法都支持，而且功能也比较全面 --> chai官网。

chai支持should、expect和assert三种断言形式。

assert语法之前我们已经见过了，chai只是丰富了功能，语法并没有变化。
expect和should的语法更接近自然语言的习惯，但是should使用的时候会出现一些意想不到的情况。所以比较常用的还是expect。

官方的DEMO

var expect = chai.expect;

expect(foo).to.be.a('string');
expect(foo).to.equal('bar');
expect(foo).to.have.length(3);
expect(tea).to.have.property('flavors')
  .with.length(3);
明显语法的可读性更好，更接近人类的语言。

简单的解释其中的to、be这样的语法。

chai使用了链式语法，为了使语法更加接近自然语言，添加了很多表达语义但是没有任何功能的词汇。

to
be
been
is
that
which
and
has
have
with
at
of
same
上面列出的这些词没有任何功能，只是为了增强语义。

也就是说
expect(1+1).to.be.equal(2)
与
expect(1+1).equal(2)
是完全相同的。

安装chai
在终端输入：

$ npm install --save-dev chai
使用chai
在test目录下新建一个chai.test.js文件，内容如下：

const expect = require('chai').expect;

describe('chai expect demo', function() {
    it('expect equal', function() {
        expect(1+1).to.equal(2);
        expect(1+1).not.equal(3);
    });
});
在终端输入：

$ npm test -- --grep 'expect equal'
得到输出：

  chai expect demo
    ✓ expect equal


  1 passing (6ms)
说明配置成功。有关chai的更多功能请查看官方API --> chai_api

返回顶部
5.3 supertest
目前我们可以使用测试框架做一些简单的测试，想要测试接口的相应数据，就要用到supertest了。

supertest主要功能就是对HTTP进行测试。尤其是对REST API，我们对get请求很容易模拟，但是post方法就很难（当然你也可以使用postman这样的插件）。

supertest可以模拟HTTP的各种请求，设置header，添加请求数据，并对响应进行断言。

安装supertest
在终端输入：

$ npm install --save-dev supertest
使用supertest
我们对现有的两个API接口getUser和registerUser进行测试。在test目录下创建user_api.test.js文件，内容如下：

const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app.js');

describe('user_api', () => {
    
    it('getUser', (done) => {

        request(app.listen())
            .get('/api/users/getUser?id=1')     //get方法
            .expect(200)                        //断言状态码为200
            .end((err, res) => {

                console.log(res.body);
                //断言data属性是一个对象
                expect(res.body.data).to.be.an('object');

                done();
            });
    })

    it('registerUser', (done) => {

        // 请求参数，模拟用户对象
        var user = {
            username: '阿，希爸',
            age: 31
        }

        request(app.listen())
            .post('/api/users/registerUser')            //post方法
            .send(user)                                 //添加请求参数
            .set('Content-Type', 'application/json')    //设置header的Content-Type为json
            .expect(200)                                //断言状态码为200
            .end((err, res) => {

                console.log(res.body);
                //断言返回的code是0
                expect(res.body.code).to.be.equal(0);
                done();
            })
    })
})
如果现在直接运行npm test进行测试会报错，原因是mocha默认是不支持async await语法，解决的办法是Babel。

Babel的主要作用是对不同版本的js进行转码。

如果你对Babel不了解，请仔细阅读Babel 入门教程与Babel官网。

由于koa-generator已经帮我们添加相关的Babel依赖，我们只需要添加相关的规则就可以了。在项目的根目录下添加一个.babelrc文件，内容如下：

{
  "env": {
    "test": {
        "presets": ["es2015-node5"],
        "plugins": [
            "transform-async-to-generator",
            "syntax-async-functions"
        ]
    }
  }
}
这段文件的意思是对当env=test时，应用es2015-node5、transform-async-to-generator、syntax-async-functions规则进行转码。

Babel我们设置好了，想要mocha应用这个规则还要在执行时添加一个命令。
打开package.json，将scripts.test修改为：

"test": "NODE_ENV=test mocha --compilers js:babel-core/register",
在终端执行npm test，输出如下内容说明测试通过。

  user_api
  <-- GET /api/users/getUser?id=1
  --> GET /api/users/getUser?id=1 200 14ms 74b
{ code: 0,
  message: 'success',
  data: { username: '阿，希爸', age: 30 } }
    ✓ getUser (57ms)
  <-- POST /api/users/registerUser
registerUser { username: '阿，希爸', age: 31 }
  --> POST /api/users/registerUser 200 2ms 30b
{ code: 0, message: 'success' }
    ✓ registerUser
```
