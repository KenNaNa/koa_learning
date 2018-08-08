const parseQueryStr = require('./parseQueryStr.js');
// 注意：ctx.request是context经过封装的请求对象，
// ctx.req是context提供的node.js原生HTTP请求对象，
// 同理ctx.response是context经过封装的响应对象，
// ctx.res是context提供的node.js原生HTTP请求对象。
function parsePostData(ctx){
	return new Promise((resolve,reject)=>{
		try{
			let postdata = '';
			ctx.req.addListener('data',(data)=>{
				postdata += data;
			})

			ctx.req.addListener('end',()=>{
				console.log(postdata);
				let parseData = parseQueryStr(postdata);
				resolve(parseData);
			})
		}catch(err){
			reject(err)
		}
	})
}

module.exports = parsePostData;