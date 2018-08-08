const Koa = require('koa')

const app = new Koa()
const render = require('./middleware/render.js')
const route = require('./middleware//route.js')



app.use(async(ctx)=>{
	let url = ctx.request.url;
	let html = await route(url); 
	ctx.body = html;
})

app.listen(3000);
console.log("the server run on localhost:3000");