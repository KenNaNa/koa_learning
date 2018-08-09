function increase(num, callback) {
   setTimeout(() => {
     if( !(num >= 0) ) {
       callback(new Error('The parameters must be greater than zero'), null)
     } else {
      let result = num + 1;
      callback(null, result);
     }
   }, 100)
}

increase(1, (err, result1) => {
  if(!err) {
    console.log(`result1 = ${result1}`)

    increase(result1, (err, result2) => {
      if(!err) {
        console.log(`result2 = ${result2}`)

        increase(result2, (err, result3) => {
          if(!err) {
            console.log(`result3 = ${result3}`)
          } else {
            console.log(err)
          }
        })
      } else {
        console.log(err)
      }
    })
  } else {
    console.log(err)
  }
})
// 运行结果
// "result1 = 2"
// "result1 = 3"
// "result1 = 4"