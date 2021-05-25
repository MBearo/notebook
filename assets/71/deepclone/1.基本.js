function deepClone (target) {
  if (typeof target === 'object') {
    const obj = {}
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
// test
const target = {
  field1: 1,
  field2: undefined,
  field3: 'ConardLi',
  field4: {
    child: 'child',
    child2: {
      child2: 'child2'
    }
  }
}
console.log(deepClone(target))
