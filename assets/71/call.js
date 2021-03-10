/* eslint-disable no-extend-native */
Function.prototype.myCall = Function.prototype.myCall || function (obj) {
  obj.fun = this
  return obj.fun()
}
// 需要传参
Function.prototype.myCall = Function.prototype.myCall || function (obj) {
  obj.fun = this
  var arg = []
  for (var i = 1; i < arguments.length; i++) {
    arg.push('arguments[' + i + ']')
  }
  var result = eval('obj.fun(' + arg + ')')
  delete obj.fun
  return result
}
/**
 * 最终目的是为了拼出一个参数字符串，我们一步一步看：
 * var args = [];
 * for(var i = 1, len = arguments.length; i < len; i++) {
 *         args.push('arguments[' + i + ']');
 * }
 * 最终的数组为：
 *
 * var args = [arguments[1], arguments[2], ...]
 * 然后
 *
 *  var result = eval('context.fn(' + args +')');
 * 在eval中，args 自动调用 args.toString()方法，eval的效果如 jawil所说，最终的效果相当于：
 *
 *  var result = context.fn(arguments[1], arguments[2], ...);
 * 这样就做到了把传给call的参数传递给了context.fn函数
 */

// fun 如果重名就很尴尬
Function.prototype.myCall = Function.prototype.myCall || function (obj) {
  var id = 0
  while (obj[id]) {
    id++
  }
  obj[id] = this
  var arg = []
  for (var i = 1; i < arguments.length; i++) {
    arg.push('arguments[' + i + ']')
  }
  var result = eval('obj[' + id + '](' + arg + ')')
  delete obj[id]
  return result
}
// 但是这么写会有一个bug
// window上无法添加 number 类型的属性
// https://www.zhihu.com/question/281236594/answer/419184149

Function.prototype.myCall = Function.prototype.myCall || function (obj) {
  var id = 0
  while (obj[id]) {
    id++
  }
  obj['fn' + id] = this
  var arg = []
  for (var i = 1; i < arguments.length; i++) {
    arg.push('arguments[' + i + ']')
  }
  var result = eval('obj[fn' + id + '](' + arg + ')')
  delete obj['fn' + id]
  return result
}

// 还有一个特性，就是第一个参数如果是有包装类型的基本类型（number,string,boolean），会在内部指向原始值的包装类型
// 在非严格模式下，如果传 null 或者 undefined 则会指向 window
// 严格模式下，传啥是啥
Function.prototype.myCall = Function.prototype.myCall || function (obj) {
  if (obj === null || obj === undefined) {
    obj = window
  } else {
    obj = Object(obj)
  }
  var id = 0
  while (obj[id]) {
    id++
  }
  obj['fn' + id] = this
  var arg = []
  for (var i = 1; i < arguments.length; i++) {
    arg.push('arguments[' + i + ']')
  }
  var result = eval('obj["fn' + id + '"](' + arg + ')')
  delete obj['fn' + id]
  return result
}

/**
 * 非严格模式
 * function x(){return this}
 * x.call(null)  // window
 * x.call()  // window
 * x.call(undefined)  // window
 */

/**
 * 严格模式
 * 'use strict'
 * function x(){return this}
 * x.call(null)  // null
 * x.call()  // undefined
 * x.call(undefined)  // undefined
 */
