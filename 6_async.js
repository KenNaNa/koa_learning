const Koa = require('koa') // koa v2
const loggerAsync  = require('./middleware/logger-async')
const app = new Koa()
// 中间件必须放在这一步之后
app.use( async ( ctx ,next) => {
  ctx.body = 'hello koa2';
  next()
})

app.use(loggerAsync)

// 在中间件之后的东西时不会执行的
app.use(async (ctx,next)=>{
	ctx.body = "这是中间件"
})





app.listen(3000)
console.log('the server is starting at port 3000')