const Koa = require('koa') // koa v2
const convert = require('koa-convert')
const loggerGenerator  = require('./middleware/logger-generator');
const app = new Koa()

app.use(convert(loggerGenerator))
app.use(async (ctx)=>{
	ctx.body = "hello wolrd"
})

app.listen(3000)
console.log("the server run on localhost:3000")