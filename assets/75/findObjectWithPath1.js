// 访问所有的对象及其路径
var set = new Set()
var globalProperties0 = [
  'Array',
  'ArrayBuffer',
  'Atomics',
  'BigInt',
  'BigInt64Array',
  'BigUint64Array',
  'Boolean',
  'DataView',
  'Date',
  'Error',
  'EvalError',
  'Float32Array',
  'Float64Array',
  'Function',
  // Generator对象是由一个 generator function 返回的
  // 'Generator',
  // GeneratorFunction并不是一个全局对象
  // 'GeneratorFunction',
  'Infinity',
  'Int16Array',
  'Int32Array',
  'Int8Array',
  // 并不是一个全局对象
  // 'InternalError',
  'Intl',
  // 'Intl.Collator',
  // 'Intl.DateTimeFormat',
  // 'Intl.DisplayNames',
  // 'Intl.ListFormat',
  // 'Intl.Locale',
  // 'Intl.NumberFormat',
  // 'Intl.PluralRules',
  // 'Intl.RelativeTimeFormat',
  // 'Iterator',
  'JSON',
  'Map',
  'Math',
  'NaN',
  'Number',
  'Object',
  'Promise',
  'Proxy',
  'RangeError',
  'ReferenceError',
  'Reflect',
  'RegExp',
  'Set',
  'SharedArrayBuffer',
  'String',
  'Symbol',
  'SyntaxError',
  'TypeError',
  // 语法格式，不能直接运行，
  // 'TypedArray',
  'URIError',
  'Uint16Array',
  'Uint32Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'WeakMap',
  'WeakSet',
  'WebAssembly',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'escape',
  'eval',
  'globalThis',
  'isFinite',
  'isNaN',
  // 'null',
  'parseFloat',
  'parseInt'
  // 'undefined',
]

var globalProperties = [
  'eval',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Array',
  'Date',
  'RegExp',
  'Promise',
  'Proxy',
  'Map',
  'WeakMap',
  'Set',
  'WeakSet',
  'Function',
  'Boolean',
  'String',
  'Number',
  'Symbol',
  'Object',
  'Error',
  'EvalError',
  'RangeError',
  'ReferenceError',
  'SyntaxError',
  'TypeError',
  'URIError',
  'ArrayBuffer',
  'SharedArrayBuffer',
  'DataView',
  'Float32Array',
  'Float64Array',
  'Int8Array',
  'Int16Array',
  'Int32Array',
  'Uint8Array',
  'Uint16Array',
  'Uint32Array',
  'Uint8ClampedArray',
  'Atomics',
  'JSON',
  'Math',
  'Reflect'
]

var queue = []

const ObjectsTreeeData = {
  id: 'globalThis',
  children: []
}

for (var p of globalProperties) {
  queue.push({
    path: [p],
    object: this[p]
  })

  ObjectsTreeeData.children.push({ id: `${p}`, children: [] })
}

var current

var preData

const resObj = {}

queue.forEach((current, currentIndex) => {
  /*
    Object.getOwnPropertyNames()方法返回一个由指定对象的所有自身属性的属性名
    （包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
    */
  for (const p of Object.getOwnPropertyNames(current.object)) {
    /*
        Object.getOwnPropertyDescriptor() 方法返回指定对象上一个自有属性对应的属性描述符。
        （自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
        */
    var property = Object.getOwnPropertyDescriptor(current.object, p)

    /*
        hasOwnProperty() 方法会返回一个布尔值，
        指示对象自身属性中是否具有指定的属性（也就是，是否有指定的键）。
        */
    if (property.hasOwnProperty('value') &&
            ((property.value != null) && (typeof property.value === 'object') || (typeof property.value === 'function')) &&
            property.value instanceof Object) {
      ObjectsTreeeData.children[currentIndex].id === current.path
      ObjectsTreeeData.children[currentIndex].children.push({ id: `${p}`, children: [] })
    } else if (property.hasOwnProperty('get') && (typeof property.get === 'function')) {
      ObjectsTreeeData.children[currentIndex].id === current.path
      ObjectsTreeeData.children[currentIndex].children.push({ id: `${p}-(get)` })
    } else if (property.hasOwnProperty('set') && (typeof property.set === 'function')) {
      ObjectsTreeeData.children[currentIndex].id === current.path
      ObjectsTreeeData.children[currentIndex].children.push({ id: `${p}-(set)` })
    }
    // else if (property.hasOwnProperty('value') && typeof property.value !== 'symbol' && !isNaN(property.value)) {
    //     ObjectsTreeeData.children[currentIndex].id === current.path;
    //     ObjectsTreeeData.children[currentIndex].children.push({ id: `${p}-(value-number)` })

    // }
    if (`${p}` === 'prototype') {
      for (const pChild of Object.getOwnPropertyNames(property.value)) {
        if (ObjectsTreeeData.children[currentIndex].children[0]) {
          ObjectsTreeeData.children[currentIndex].children[0].children.push({ id: pChild })
        }
      }
    }
  }
})

// let b = Array.from(set);//转换为数组

// const c = b.filter((item) => item.includes('globalThis'))
