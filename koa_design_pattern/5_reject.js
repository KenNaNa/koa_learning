let p = new Promise((resolve,reject)=>{
	setTimeout(()=>{
		let result = 2;
		reject(result);
	},100)
})

// 有两种方式获取失败状态
// 第一种，通过then 第二个函数参数处理失败状态
p.then((result)=>{
	console.log('success',result);
},(result)=>{
	console.log('fail',result);
})

// 第二种，或者通过，catch 获取失败状态
p.then((result)=>{ 
    console.log('success:',result);
}).catch((result)=>{ 
    console.log('error:',result);
})
// "error: 2"


// 注意：如果两种方式同时使用的话
// 只会被第一种方式reject操作失败的结果
p.then((result)=>{ 
    console.log('success:',result);
}, (result)=>{ 
    console.log('fail:',result);
}).catch((result)=>{ 
    console.log('error:',result);
})
// "fail: 2"