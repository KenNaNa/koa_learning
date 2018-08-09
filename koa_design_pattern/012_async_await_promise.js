// 封装原子任务
function increase(num) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if( !(num >= 0) ) {
        reject(new Error('The parameters must be greater than zero'))
      } else {
        resolve(num + 1)
      }

    }, 100);
  }).catch(err => console.log(err))

}

// 声明任务环境
async function envIncrease() {
  let num = 1;
  // 等待回调任务结果1返回
  let result1 = await increase(num);
  console.log(`result1 = ${result1}`);

  // 等待回调任务结果2返回
  let result2 = await increase(result1);
  console.log(`result2 = ${result2}`);

  // 等待回调任务结果3返回
  let result3 = await increase(result2);
  console.log(`result3 = ${result3}`);

  return result3
}

// 声明任务环境
async function env() {
  // 等待 环境 Increase 的结果返回
  let result = await envIncrease()
  console.log(`result = ${result}`);
}

// 运行环境
env()



// 运行结果
// "result1 = 2"
// "result1 = 3"
// "result1 = 4"