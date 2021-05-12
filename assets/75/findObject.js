// 访问到ECmascript中的所有对象
var set = new Set()
var queue = [eval, isFinite, isNaN, parseFloat, parseInt, decodeURI, decodeURIComponent, encodeURI, encodeURIComponent, Array, Date, RegExp, Promise, Proxy, Map, WeakMap, Set, WeakSet, Function, Boolean, String, Number, Symbol, Object, Error, EvalError, RangeError, ReferenceError, SyntaxError, TypeError, URIError, ArrayBuffer, SharedArrayBuffer, DataView, Float32Array, Float64Array, Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Uint8ClampedArray, Atomics, JSON, Math, Reflect]

let current

while (queue.length) {
  current = queue.shift()
  // set做去重，避免一直循环
  if (set.has(current)) {
    continue
  }
  set.add(current)
  console.log(current)
  /*
    Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名
    （包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
    */
  for (const p of Object.getOwnPropertyNames(current)) {
    /*
        Object.getOwnPropertyDescriptor() 方法返回指定对象上一个自有属性对应的属性描述符。
        （自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
        */
    var property = Object.getOwnPropertyDescriptor(current, p)
    /*
        hasOwnProperty() 方法会返回一个布尔值，
        指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。
        */
    if (property.hasOwnProperty('value') && property.value instanceof Object) {
      queue.push(property.value)
    }
    // 例如 Map.size 是gtter
    if (property.hasOwnProperty('getter')) {
      queue.push(property.getter)
    }
    if (property.hasOwnProperty('setter')) {
      queue.push(cproperty.setter)
    }
  }
}
