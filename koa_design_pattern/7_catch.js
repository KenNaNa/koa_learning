let p = new Promise((resolve, reject) => {
    reject(3)
});

p.then((result) => {
    console.log('success:', result)
}).catch((result) => {
    console.log('error:', result)
})

// "error: 3"