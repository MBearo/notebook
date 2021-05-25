
// 支持数组
function deepClone (target) {
  if (typeof target === 'object') {
    const obj = Array.isArray(target) ? [] : {}
    for (const key in target) {
      if (Object.hasOwnProperty.call(target, key)) {
        obj[key] = deepClone(target[key])
      }
    }
    return obj
  } else {
    return target
  }
}

const target2 = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child'
  },
  field4: [2, 4, 8]
}

console.log(deepClone(target2))
