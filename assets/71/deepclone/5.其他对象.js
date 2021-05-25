const mapTag = '[object Map]'
const setTag = '[object Set]'
const arrayTag = '[object Array]'
const objectTag = '[object Object]'
const argsTag = '[object Arguments]'

const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag]

// 判断是否是引用类型
function isObject (target) {
  return target !== null && (typeof target === 'function' || typeof target === 'object')
}

function getType (target) {
  return Object.prototype.toString.call(target)
}

// 通过构造函数拿到对象的原型上的方法
function getInit (target) {
  const Constructor = target.constructor
  return new Constructor()
}

function cloneOtherType (target, type) {
  const Constructor = target.constructor
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Constructor(target)
    case regexpTag:
      return cloneReg(target)
    case symbolTag:
      return cloneSymbol(target)
    default:
      return null
  }
}
function cloneReg (target) {
  const reFlags = /\w*$/
  const result = new target.constructor(target.source, reFlags.exec(target))
  result.lastIndex = target.lastIndex
  return result
}

function cloneSymbol (target) {

}

function deepClone (target, map = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    return target
  }
  // 初始化
  const type = getType(target)
  let cloneTarget
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target)
  }
  // 防止循环引用
  if (map.has(target)) {
    return target
  }
  map.set(target, cloneTarget)

  // 克隆set
  if (type === setTag) {
    target.forEach(v => {
      cloneTarget.add(deepClone(v, map))
    })
    return cloneTarget
  }
  // 克隆map
  if (type === mapTag) {
    // map的forEach方法一定要注意参数
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value, map))
    })
    return cloneTarget
  }
  // 克隆对象和数组
  // const keys = type === arrayTag ? undefined : Object.keys(target)

  for (const key in target) {
    cloneTarget[key] = deepClone(target[key], map)
  }
  return cloneTarget
}

const map = new Map()
map.set('key', 'value')
map.set('ConardLi', 'code秘密花园')

const set = new Set()
set.add('ConardLi')
set.add('code秘密花园')

const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child'
  },
  field4: [2, 4, 8],
  empty: null,
  map,
  set
}

const result = deepClone(target)

console.log(result)
console.log(result.map === target.map)
