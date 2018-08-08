const koa = require('koa')
const app = new koa()
const router = require('koa-router')

const _ = new router()
_.get('/hello',getMessage);

function *getMessage(){
	this.body = "hello world";
}

app.use(_.routes());//

app.listen(3000);