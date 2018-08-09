const http = require('http');
const PORT = 3001;
const router = (req, res) => {
  res.end(`this page url = ${req.url}`);
}
const server = http.createServer(router)
server.listen(PORT, function() {
  console.log(`the server is started at port ${PORT}`)
})