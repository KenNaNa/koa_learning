如果是全局安装了mocha，可以直接在当前项目目录下执行 mocha --harmony 命令
如果当前node.js版本低于7.6，由于7.5.x以下还直接不支持async/awiar就需要加上--harmony

用例详解
服务入口加载
如果要对一个服务的API接口，进行单元测试，要用supertest加载服务的入口文件

const supertest = require('supertest')
const request = supertest( app.listen() )
测试套件、用例
describe()描述的是一个测试套件
嵌套在describe()的it()是对接口进行自动化测试的测试用例
一个describe()可以包含多个it()
describe( '开始测试demo的GET请求', ( ) => {
  it('测试/getString.json请求', () => {
      // TODO ...
  })
})
supertest封装服务request，是用来请求接口
chai.expect使用来判断测试结果是否与预期一样
chai 断言有很多中方法，这里只是用了数据类型断言