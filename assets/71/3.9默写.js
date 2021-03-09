/* eslint-disable no-extend-native */
Function.prototype.myBind = Function.prototype.myBind || function (ctx) {
  var self = this
  var arg = Array.prototype.slice.call(arguments, 1)
  function fun () {
    var innerArg = Array.prototype.slice.call(arguments)
    /**
     * @error
     *  return self.apply(this instanceof self ? this : ctx, arg.concat(innerArg))
     * 判断是否被 new，是判断的 bind 之后返回的函数是否被 new
     */
    return self.apply(this instanceof fun ? this : ctx, arg.concat(innerArg))
  }
  fun.prototype.__proto__ = self.prototype
  return fun
}

function offset (ele) {
  if (window.getComputedStyle(ele).display === 'none') {
    return {
      left: 0,
      top: 0
    }
  }
  var parent = ele.ownerDocument.documentElement
  var bound = ele.getBoundingClientRect()
  return {
    left: window.scrollX + bound.left - parent.clientLeft,
    top: window.scrollY + bound.top - parent.clientTop
  }
}

const pipe = (...arg) => v => {
  return arg.reduce((acc, cur) => cur(acc), v)
}
// 不过关
const compose = (...funcs) => (...arg) => {
  return funcs.reduceRight((acc, cur) => cur.apply(this, acc), arg)
}

Array.prototype.myReduce = Array.prototype.myReduce || function (callback, initialValue) {
  var arr = this.slice()
  if (initialValue !== undefined) {
    arr.unshift(initialValue)
  }
  let base = arr[0]
  /**
    * @error
    * for (var i = 0; i < arr.length; i++) {
    *   base = callback(base, arr[i], i, this)
    *  }
    * 两个值一样了
    */
  for (var i = 0; i < arr.length - 1; i++) {
    base = callback(base, arr[i + 1], i, this)
  }
  return base
}
