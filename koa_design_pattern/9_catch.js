let p = new Promise((resolve) => {
    reject(3)
});

p.then(null, (result) => {
    throw new Error('custom reject error!')
    console.log('fail:', result)
}).catch((err) => {
    console.log('Custom error:', err)
})
// "Custom error: Error: custom reject error!"