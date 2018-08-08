/**
 * 根据URL获取HTML内容
 * @param  {string} url koa2上下文的url，ctx.url
 * @return {string}     获取HTML文件内容
 */
const render = require('./render.js')
async function route(url){
	let view = '404.html';
	switch(url){
		case '/':
			view = 'index.html';
			break;
		case '/index':
			view = 'index.html';
			break;
		case '/todo':
			view  = 'todo.html';
			break;
		case '/404':
			view = '404.html';
			break;
		default:
			view = "404.html";
	}
	let html = await render( view );
  	return html;
}

module.exports = route