const http = require('http');
const PORT = 3001;

// 控制器
const controller = {
  index(req, res) {
    res.end('This is index page')
  },
  home(req, res) {
    res.end('This is home page')
  },
  _404(req, res) {
    res.end('404 Not Found')
  }
}

// 路由器
const router = (req, res) => {
  if( req.url === '/' ) {
    controller.index(req, res)
  } else if( req.url.startsWith('/home') ) {
    controller.home(req, res)
  } else {
    controller._404(req, res)
  }
}

// 服务
const server = http.createServer(router)
server.listen(PORT, function() {
  console.log(`the server is started at port ${PORT}`)
})