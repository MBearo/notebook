/* eslint-disable no-extend-native */
Function.prototype.myApply = Function.prototype.myApply || function (ctx) {
  // 完全忘了。。。。
}

Function.prototype.myCall = Function.prototype.myCall || function (ctx) {
  // 这么判断不对，0 之类的有问题。
  if (!ctx) {
    ctx = window
  }
  var id = 0
  // 这个判断写反了
  while (!ctx.id) {
    id++
  }
  ctx['fn' + id] = this
  var arg = []
  for (var i = 1; i < arguments.length; i++) {
    arg.push('arguments[' + i + ']')
  }
  // 这里fn的字符串拼接有问题，因为fn应该是个字符串
  var result = eval('ctx[fn' + id + '](' + arg + ')')
  delete ctx['fn' + id]
  return result
}
// 重新写一下call
Function.prototype.myCall = Function.prototype.myCall || function (ctx) {
  if (ctx == null || ctx == window) {
    ctx = window
  } else {
    ctx = Object(ctx)
  }
  var id = 0
  while (ctx['fn' + id]) {
    id++
  }
  ctx['fn' + id] = this
  var arg = []
  for (var i = 1; i < arguments.length; i++) {
    arg.push('arguments[' + i + ']')
  }
  var result = eval('ctx["fn' + id + '"](' + arg + ')')
  delete ctx['fn' + id]
  return result
}
// 有了call就可以apply了
Function.prototype.myApply = Function.prototype.myApply || function (ctx, arg) {
  if (ctx == null || ctx == window) {
    ctx = window
  } else {
    ctx = Object(ctx)
  }
  var id = 0
  while (ctx['fn' + id]) {
    id++
  }
  ctx['fn' + id] = this
  var args = []
  for (var i = 0; i < arg.length; i++) {
    args.push('arg[' + i + ']')
  }
  var result = eval('ctx["fn' + id + '"](' + args + ')')
  delete ctx['fn' + id]
  return result
}

Function.prototype.myBind = Function.prototype.myBind || function (ctx) {
  // 这连ctx都塞到数组里了
  // 用Array原型上的，不知道和String上的有没有区别
  var args = String.prototype.slice.call(this)
  return function () {
    var innerArgs = String.prototype.slice.call(this)
    // this用的不对
    // 没有判断是否被new
    return Function.prototype.apply(this, args.concat(innerArgs))
  }
}

Function.prototype.myBind = Function.prototype.myBind || function (ctx) {
  var self = this
  var args = Array.prototype.slice.call(this)
  return function fun() {
    var innerArgs = Array.prototype.slice.call(this)
    // this用的不对
    return self.apply(this instanceof fun ? this : self, args.concat(innerArgs))
  }
}
// 原型方法
Function.prototype.myBind = Function.prototype.myBind || function (ctx) {
  var self = this
  var args = Array.prototype.slice.call(this)
  function fun() {
    var innerArgs = Array.prototype.slice.call(this)
    // this用的不对
    return self.apply(this instanceof fun ? this : self, args.concat(innerArgs))
  }
  fun.prototype.__proto__ = self.prototype
  return fun
}
// 参数也不对
Function.prototype.myBind = Function.prototype.myBind || function (ctx) {
  var self = this
  var args = Array.prototype.slice.call(arguments, 1)
  function fun() {
    var innerArgs = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof fun ? this : self, args.concat(innerArgs))
  }
  fun.prototype.__proto__ = self.prototype
  return fun
}
// 判断是否被new也不对
Function.prototype.myBind = Function.prototype.myBind || function (ctx) {
  var self = this
  var args = Array.prototype.slice.call(arguments, 1)
  function fun() {
    var innerArgs = Array.prototype.slice.call(arguments)
    return self.apply(this instanceof fun ? this : ctx, args.concat(innerArgs))
  }
  fun.prototype.__proto__ = self.prototype
  return fun
}
// 也对
const pipe = (...args) => x => args.reduce((acc, cur) => cur(acc(x)))
// 最后面那个参数没结构
const compose = (...args) => (...arg) => args.reduceRight((acc, cur) => cur(acc(arg)))
const compose = (...args) => (...arg) => args.reduceRight((acc, cur) => cur(acc(...arg)))

