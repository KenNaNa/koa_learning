/**
 * 用Promise封装异步读取文件方法
 * @param  {string} page html文件名称
 * @return {promise}      
 */
const fs = require('fs')
function render(page){
	return new Promise((resolve,reject)=>{
		let viewUrl = `./view/${page}`;
		fs.readFile(viewUrl,(err,data)=>{
			if(err){
				reject(err)
			}else{
				console.log(data)
				// toString()
				// 转换为字符串
				resolve(data.toString())
			}
		})
	})
}

module.exports = render;