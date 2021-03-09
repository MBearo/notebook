/* eslint-disable no-extend-native */
Function.prototype.myCall = Function.prototype.myCall || function (obj) {
  obj.fun = this
  return obj.fun()
}
