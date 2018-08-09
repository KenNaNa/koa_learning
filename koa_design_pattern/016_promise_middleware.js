let context = {
  data: []
};

async function middleware1(ctx, next) {
  console.log('action 001');
  ctx.data.push(1);
  await next();
  console.log('action 006');
  ctx.data.push(6);
}

async function middleware2(ctx, next) {
  console.log('action 002');
  ctx.data.push(2);
  await next();
  console.log('action 005');
  ctx.data.push(5);
}

async function middleware3(ctx, next) {
  console.log('action 003');
  ctx.data.push(3);
  await next();
  console.log('action 004');
  ctx.data.push(4);
}

Promise.resolve(middleware1(context, async() => {
  return Promise.resolve(middleware2(context, async() => {
    return Promise.resolve(middleware3(context, async() => {
      return Promise.resolve();
    }));
  }));
}))
  .then(() => {
    console.log('end');
    console.log('context = ', context);
  });



// 结果显示
// "action 001"
// "action 002"
// "action 003"
// "action 004"
// "action 005"
// "action 006"
// "end"
// "context = { data: [1, 2, 3, 4, 5, 6]}"