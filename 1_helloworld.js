const Koa = require('koa')
const app = new Koa();
app.use(function* (){
	this.body = "hello world";
})


app.listen(3000,()=>{
	console.log("Server running on https://localhost:3000")
})
