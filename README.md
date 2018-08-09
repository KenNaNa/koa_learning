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
