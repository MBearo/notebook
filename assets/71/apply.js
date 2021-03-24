/* eslint-disable no-extend-native */
Function.prototype.myApply = Function.prototype.myApply || function (obj, arr) {
  if (obj === null || obj === undefined) {
    obj = window
  } else {
    obj = Object(obj)
  }
  var id = 0
  while (obj['fn' + id]) {
    id++
  }
  obj['fn' + id] = this
  var args = []
  for (var i = 0; i < arr.length; i++) {
    args.push('arr[' + i + ']')
  }
  var result = eval('obj["fn' + id + '"](' + args + ')')
  delete obj['fn' + id]
  return result
}
// 第一次写忘了 delete
// 并且把 while 写成死循环了
