function myNew(fn) {
  var obj = {}
  obj.__proto__ = fn.prototype
  var result = fn.apply(obj, Array.prototype.slice.call(arguments, 1))
  var type = Object.prototype.toString.call(result).match(/\[object (.*?)\]/)[1].toLowerCase()
  if (type === 'string'
    || type === 'number'
    || type === 'boolean'
    || type === 'symbol'
    || type === 'bigint'
    || type === 'null'
    || type === 'undefined'
  ) {
    return obj
  } else {
    return result
  }
}

function A(name) {
  this.name = name
  return [1, 2, 3]
}
function B(name) {
  this.name = name
  return 'aosjfoia'
}
function C(name) {
  this.name = name
  return {
    age: 10
  }
}
function D(name) {
  this.name = name
  return function haha() {
    console.log(1111)
  }
}
function E(name) {
  this.name = name
  return 1234
}
function F(name) {
  this.name = name
  return Symbol(345)
}
function G(name) {
  this.name = name
  return 234n
}
function H(name) {
  this.name = name
  return /\[object (.*?)\]/
}
var a = new A('nihao')
var b = new B('nihao')
var c = new C('nihao')
var d = new D('nihao')
var e = new E('nihao')
var f = new F('nihao') 
var g = new G('nihao')
var h = new H('nihao')

// 优化一下，不用那么长的判断
function myNew(fn) {
  var obj = {}
  obj.__proto__ = fn.prototype
  var result = fn.apply(obj, Array.prototype.slice.call(arguments, 1))
  if (typeof result === 'function' || (typeof result === 'object' && result !== null)) {
    return result
  } else {
    return obj
  }
}