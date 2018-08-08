var generator_func = function*(){
	yield 1;
	yield 2;
}

var itr = generator_func();
console.log(itr.next())
console.log(itr.next())
console.log(itr.next())

/**
 { value: 1, done: false }
{ value: 2, done: false }
{ value: undefined, done: true }
 */