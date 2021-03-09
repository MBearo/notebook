/* eslint-disable no-extend-native */

// Array.prototype.reduce = Array.prototype.reduce || function (callback, initialValue) {

// 第一版
Array.prototype.myReduce = function (callback, initialValue) {
  var arr = this.slice()
  if (initialValue) {
    arr.unshift(initialValue)
  }
  for (var i = 0; i < arr.length - 1; i++) {
    const element = arr[i]
    arr[i + 1] = callback(element, arr[i + 1], i)
  }
  return arr[arr.length - 1]
}

// 首先callback有第四个参数
// 直接原型链上加，会使这个方法可以被枚举。
// Object.defineProperty 的 configurable 和 enumerable 默认是 false
// 还有一堆错误没判断和处理

if (!Array.prototype.myReduce) {
  Object.defineProperty(Array.prototype, 'myReduce', {
    value: function (callback, initialValue) {
      var arr = this.slice()
      // 如果为 null 或者 0，在老代码就不对了
      // === 或者 !== 是因为 eslint
      if (typeof initialValue !== 'undefined') {
        arr.unshift(initialValue)
      }
      for (var i = 0; i < arr.length - 1; i++) {
        const element = arr[i]
        arr[i + 1] = callback(element, arr[i + 1], i, this)
      }
      return arr[arr.length - 1]
    }
  })
}

// 写完 compose 时发现，reduce 还有个特点
// 如果 callback 没有返回值，reduce 就没有返回值

if (!Array.prototype.myReduce) {
  Object.defineProperty(Array.prototype, 'myReduce', {
    value: function (callback, initialValue) {
      var arr = this.slice()
      // 如果为 null 或者 0，在老代码就不对了
      // === 或者 !== 是因为 eslint
      if (typeof initialValue !== 'undefined') {
        arr.unshift(initialValue)
      }
      var base = arr[0]
      for (var i = 0; i < arr.length - 1; i++) {
        base = callback(base, arr[i + 1], i, this)
      }
      return base
    }
  })
}

;[2, 3, 4].reduce(() => { })
;[2, 3, 4].myReduce(() => { })

;[2, 3, 4].reduce((acc, cur) => acc)
;[2, 3, 4].reduce((acc, cur) => cur)

;[2, 3, 4].myReduce((acc, cur) => acc)
;[2, 3, 4].myReduce((acc, cur) => cur)

;[2, 3, 4].reduce((acc, cur) => acc, 6)
;[2, 3, 4].reduce((acc, cur) => cur, 6)

;[2, 3, 4].myReduce((acc, cur) => acc, 6)
;[2, 3, 4].myReduce((acc, cur) => cur, 6)
