let p = new Promise((resolve)=>{
	setTimeout(()=>{
		let result = 1;
		resolve(result);
	},1000)
})

p.then(result=>{
	console.log(result);
})