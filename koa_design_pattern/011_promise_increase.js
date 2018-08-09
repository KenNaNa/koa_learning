function increase(num) {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
       if( !(num >= 0) ) {
         reject(new Error('The parameters must be greater than zero'))
       } else {
        let result = num + 1;
        resolve(result);
       }
     }, 100)
   })
}


increase(1).then((result1) => {
  console.log(`result1 = ${result1}`)

  increase(result1).then((result2) => {
    console.log(`result2 = ${result2}`)

    increase(result2).then((result3) => {
      console.log(`result3 = ${result3}`)
    }).catch(err => console.log(err));

  }).catch(err => console.log(err));

}).catch(err => console.log(err));
// 运行结果
// "result1 = 2"
// "result1 = 3"
// "result1 = 4"