const http = require('http');
const Emitter = require('events');

class WebServer extends Emitter {

  constructor() {
    super();
    // 储存中间件函数
    this.middleware = [];
    // 创建上下文对象
    this.context = Object.create({});
  }

  /**
   * 服务事件监听
   * @param {*} args 
   */
  listen(...args) {
    // 创建一个服务
    const server = http.createServer(this.callback());
    // 监听服务端口，及回调函数
    return server.listen(...args);
  }

  /**
   * 注册使用中间件
   * @param {Function} fn 
   */
  use(fn) {
    // 当调用此函数时 ，
    // 我们就把回调函数添加进队列
    if (typeof fn === 'function') {
      this.middleware.push(fn);
    }
  }

  /**
   * 中间件总回调方法
   */
  callback() {
    let that = this;
    // this指的是这个emitter事件对象
    // 函数，length是指参数为空
    if (this.listeners('error').length === 0) {
      // 监听错误信息
      this.on('error', this.onerror);
    }

    // 处理请求函数
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
            // 判断是否到达数组尽头了
            // 并且判断res.end()是否为函数
            res.end();
          }
        }
      });
    };
    return handleRequest;
  }

  /**
   * 异常处理监听
   * @param {EndOfStreamError} err 
   */
  onerror(err) {
    console.log(err);
  }

  /**
   * 创建通用上下文
   * @param {Object} req 
   * @param {Object} res 
   */
  createContext(req, res) {
    // 继承创建上下文对象
    // Object.create(this.context)
    let context = Object.create(this.context);
    context.req = req;
    context.res = res;
    return context;
  }
}

module.exports = WebServer;