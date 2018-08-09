function func(num,callbcak){
	setTimeout(()=>{
		try{
			let result = 1/num;
			callbcak(result,null);
		}catch(err){
			callbcak(null,err)
		}
	},10)
}

// 调试
func(1,(result,err)=>{
	if(err){
		console.log(err)
	}else{
		console.log(result);
	}
})