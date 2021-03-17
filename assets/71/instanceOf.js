function myInstanceof (source, target) {
  if ((typeof source !== 'function' && typeof source !== 'object') || source === null) return false
  var obj = source.__proto__
  while (obj) {
    if (obj === target.prototype) {
      return true
    } else {
      obj = obj.__proto__
    }
  }
  return false
}
