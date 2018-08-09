let p = Promise.reject(2)
p.then(null,result=>{
	console.log(result);
})

// 或者
p.then().catch(result=>{
	console.log(result);
})