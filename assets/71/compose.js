// 直接把 pipe reduce 方向一改就行了，没那么多花里胡哨的
const compose2 = (...funcs) => x => funcs.reduce((acc, cur) => cur(acc), x)

// 不行，直接一改 compose 不支持多个参数
// 利用 call 和 apply 的特性，apply 接受数组，而 arg 永远是数组
const compose3 = (...funcs) => (...arg) => funcs.reduceRight((acc, cur) => cur.call(this, acc.apply(this, arg)))

// 没发现call和apply的作用，所以改成如下
const compose4 = (...funcs) => (...arg) => funcs.reduceRight((acc, cur) => cur(acc(...arg)))

// 还有一种写法
const compose = (...funcs) => funcs.reduce((acc, cur) => (...arg) => acc(cur(...arg)))

var a = compose(x => x + 1, (x, y) => x * y)
console.log(a(3, 4)) // 13
