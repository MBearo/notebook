/* eslint-disable no-extend-native */
Function.prototype.myBind = Function.prototype.myBind || function (obj) {
  return function () {
    /**
     * function x(){console.log(1)}
     * var b=x.myBind({a:1})
     * b()
     */
    // this 指向不对，运行的时候 this 指向 window
    return this.call(obj, arguments)
  }
}

// 上面的不支持多个参数
Function.prototype.myBind = Function.prototype.myBind || function (obj) {
  var self = this
  var arg = Array.prototype.slice.call(arguments, 1)
  return function () {
    return self.apply(obj, arg.concat(arguments))
  }
}
// 不支持 bind 后的函数 new
// 如果作为构造函数，那么之前 bind 的 this 就失效
Function.prototype.myBind = Function.prototype.myBind || function (obj) {
  var self = this
  var arg = Array.prototype.slice.call(arguments, 1)
  function fun () {
    return self.apply(this instanceof fun ? this : obj, arg.concat(arguments))
  }
  // 原型上的方法别忘了
  fun.prototype = self.prototype
  return fun
}
// arguments 不是数组，所以concat不好用
Function.prototype.myBind = Function.prototype.myBind || function (obj) {
  var self = this
  var arg = Array.prototype.slice.call(arguments, 1)
  function fun () {
    var innerArg = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof fun ? this : obj, arg.concat(innerArg))
  }
  // 原型上的方法别忘了
  fun.prototype = self.prototype
  return fun
}
// 这里当时想到需要继承原型上的方法，但是忘了
Function.prototype.myBind = Function.prototype.myBind || function (obj) {
  var self = this
  var arg = Array.prototype.slice.call(arguments, 1)
  function fun () {
    var innerArg = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof fun ? this : obj, arg.concat(innerArg))
  }
  // 看大佬们写的是用一个空函数中转，原理一样
  // function f(){}
  // f.prototype=self.prototype
  // fun.prototype=new f()
  fun.prototype.__proto__ = self.prototype
  return fun
}
