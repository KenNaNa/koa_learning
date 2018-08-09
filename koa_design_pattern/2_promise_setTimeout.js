function func(num,cb){
	return new Promise((resolve)=>{
		setTimeout(()=>{
			let result = 1/num;
			// 把这个结果，扔出去
			// 在外面接收
			// 在外面处理错误
			resolve(result);
		},1000)
	})
}

func(1).then(result=>{
	console.log(result);
}).catch((err)=>{
	console.log(err);
})