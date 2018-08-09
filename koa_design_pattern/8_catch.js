let p = new Promise((resolve) => {
    resolve(3)
});

p.then((result) => {
    throw new Error('custom resolve error!')
    console.log('success:', result)
}).catch((err) => {
    console.log('Custom error:', err)
})

// "Custom error: Error: custom resolve error!"