//  pipe(f,g,h)是一个 curry 化函数，它返回一个新的函数，这个新的函数将会完成的调用。
// 即 pipe 方法返回的函数会接收一个参数，这 个参数传递给 pipe 方法第一个参数，以供其调用。

// pipe用箭头函数返回一个新函数，这个思路挺关键的
export const pipe = (...arg) => x => arg.reduce((acc, cur) => cur(acc), x)

const addOne = x => x + 1
const addTwo = x => x + 2
const addThree = pipe(addOne, addTwo)
console.log(addThree(1)) // 4
