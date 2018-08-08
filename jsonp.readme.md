实现JSONP
demo地址

https://github.com/ChenShenhai/koa2-note/blob/master/demo/jsonp/

具体原理

  // 判断是否为JSONP的请求 
  if ( ctx.method === 'GET' && ctx.url.split('?')[0] === '/getData.jsonp') {
    // 获取jsonp的callback
    let callbackName = ctx.query.callback || 'callback'
    let returnData = {
      success: true,
      data: {
        text: 'this is a jsonp api',
        time: new Date().getTime(),
      }
    } 

    // jsonp的script字符串
    let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`

    // 用text/javascript，让请求支持跨域获取
    ctx.type = 'text/javascript'

    // 输出jsonp字符串
    ctx.body = jsonpStr
  }
解析原理
JSONP跨域输出的数据是可执行的JavaScript代码
ctx输出的类型应该是'text/javascript'
ctx输出的内容为可执行的返回数据JavaScript代码字符串
需要有回调函数名callbackName，前端获取后会通过动态执行JavaScript代码字符，获取里面的数据