/* eslint-disable no-extend-native */
Array.prototype.myReduce = Array.prototype.myReduce || function (...args) {
  let result
  const array = this.slice()
  const callback = args[0]
  if (args.length > 1) {
    array.shift(args[1])
  }
  for (let i = 0; i < array.length; i++) {
    result = callback(result, array[i], i, this)
  }
  return result
}
// shift 写反了
// result 初始值也不对
// callback 第二个参数索引也选的不对
Array.prototype.myReduce = Array.prototype.myReduce || function (...args) {
  const array = this.slice()
  const callback = args[0]
  if (args.length > 1) {
    array.unshift(args[1])
  }
  let result = array[0]
  for (let i = 0; i < array.length - 1; i++) {
    result = callback(result, array[i + 1], i, this)
  }
  return result
}

function myNew(fun) {
  var obj = {}
  obj.__proto__ = fun.prototype
  var args = Array.prototype.slice.call(arguments, 1)
  fun.apply(obj, args)
  return obj
}

// 需要处理函数返回值
function myNew(fun) {
  var obj = {}
  obj.__proto__ = fun.prototype
  var args = Array.prototype.slice.call(arguments, 1)
  var result = fun.apply(obj, args)
  // 就是如果是对象就返回对象
  if (typeof result === 'function' || (typeof result === 'object' && result !== null)) {
    return result
  } else {
    return obj
  }
}

// 还是那个问题，this指向
function debounce(fun, wait) {
  let timer
  return function (...arg) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fun.call(this,...arg)
    }, wait)
  }
}