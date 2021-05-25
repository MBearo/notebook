function deepClone (target, map = new WeakMap()) {
  if (typeof target === 'object') {
    if (map.has(target)) {
      return map.get(target)
    }
    const obj = Array.isArray(target) ? [] : {}
    map.set(target, obj)
    for (const key in target) {
      if (Object.hasOwnProperty.call(target, key)) {
        obj[key] = deepClone(target[key], map)
      }
    }
    return obj
  } else {
    return target
  }
}

const target = {
  field1: 1,
  field2: undefined,
  field3: {
    child: 'child'
  },
  field4: [2, 4, 8]
}
target.target = target

console.log(deepClone(target))
