// 直接把 pipe reduce 方向一改就行了，没那么多花里胡哨的
const compose2 = (...funcs) => x => funcs.reduce((acc, cur) => cur(acc), x)

// 不行，直接一改 compose 不支持多个参数
// 利用 call 和 apply 的特性，apply 接受数组，而 arg 永远是数组
const compose = (...funcs) => (...arg) => funcs.reduceRight((acc, cur) => cur.call(this, acc.apply(this, arg)))

var a = compose(x => x + 1, (x, y) => x * y)
console.log(a(3, 4)) // 13
