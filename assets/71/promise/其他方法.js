// 实现
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function MyPromise (executor) {
  this.status = PENDING
  this.value = ''
  this.reason = ''
  this.onFulfilledFunc = []
  this.onRejectedFunc = []
  const resolve = value => {
    // 这里没太懂
    // 看下面实例
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }
    if (this.status === PENDING) {
      // 一顿分析，发现这里不需要setTimeout，同样可以过测试
      // setTimeout(() => {
      this.value = value
      this.status = FULFILLED
      this.onFulfilledFunc.forEach(fn => fn())
      // })
    }
  }
  const reject = reason => {
    if (this.status === PENDING) {
      // setTimeout(() => {
      this.reason = reason
      this.status = REJECTED
      this.onRejectedFunc.forEach(fn => fn())
      // })
    }
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    console.log(error)
    reject(error)
  }
}

// promise2 当前then返回的 promise 对象
// x 是当前 then 成功或者失败的返回值
function resolvePromise (promise2, x, resolve, reject) {
  // 2.3.1
  if (promise2 === x) {
    throw new TypeError('Chaining cycle detected fro promise #<Promise>')
  }
  // 对 x 判断，如果 x 是一个普通值，直接 resolve
  // 如果 x 是 promise，就使用 x 的状态
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let called
    try {
      const then = x.then
      if (typeof then === 'function') {
        // 防止 x.then() Object.defineProperty 会报错或者再次调用
        then.call(x, y => {
          if (called) return
          called = true
          // 递归，promise 中可能还有 promise
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          if (called) return
          called = true // 防止调用失败后又调用成功
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true // 防止出错后继续调用
      reject(error)
    }
  } else {
    resolve(x)
  }
}

// 2.2.4 onFulfilled, onRejected 必须是异步
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 解决 onFufilled，onRejected 没有传值的问题
  // 2.2.1 2.2.5 2.2.7.3 2.2.7.4
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
  // 因为错误的值要让后面访问到，所以这里也要抛出个错误，不然会在之后 then 的 resolve 中捕获
  onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }
  // 返回新的 promise 2.2.7
  const promise2 = new MyPromise((resolve, reject) => {
    const fulfilledMicrotask = () => {
      // 2.2.2
      // 2.2.4
      queueMicrotask(() => {
        try {
          // 2.2.7.1
          const x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          // 2.2.7.2
          reject(error)
        }
      })
    }
    const rejectedMicrotask = () => {
      // 2.2.3
      queueMicrotask(() => {
        try {
          const x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
    if (this.status === FULFILLED) {
      fulfilledMicrotask()
    }
    if (this.status === REJECTED) {
      rejectedMicrotask()
    }
    // 异步的时候将回调存起来
    if (this.status === PENDING) {
      this.onFulfilledFunc.push(fulfilledMicrotask)
      this.onRejectedFunc.push(rejectedMicrotask)
    }
  })
  return promise2
}

MyPromise.resolve = function (data) {
  return new MyPromise(resolve => {
    resolve(data)
  })
}
MyPromise.reject = function (data) {
  return new MyPromise((resolve, reject) => {
    reject(data)
  })
}
MyPromise.prototype.catch = function (errCallBack) {
  return this.then(null, errCallBack)
}
MyPromise.prototype.finally = function (callBack) {
  return this.then(value => {
    return MyPromise.resolve(callBack()).then(() => value)
  }, reason => {
    return MyPromise.resolve(callBack()).then(() => { throw reason })
  })
}
MyPromise.all = function (iterable) {
  // Promise.all 的参数是一个可迭代对象，如 Array 、 String、Map、Set、包含length属性的对象等，所以应该兼容一下参数。
  const array = Array.from(iterable)
  let resolveNum = 0
  const result = []
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      const element = array[i]
      MyPromise.resolve(element).then(value => {
        result[i] = value
        resolveNum++
        if (resolveNum === array.length) {
          resolve(result)
        }
      }, reason => {
        reject(reason)
      })
    }
  })
}
// 等所有都settled，然后返回所有promise状态
MyPromise.allSettled = function (iterable) {
  const array = Array.from(iterable)
  const result = []
  let settledNum = 0
  return new MyPromise(resolve => {
    for (let i = 0; i < array.length; i++) {
      const element = array[i]
      MyPromise.resolve(element).then(value => {
        settledNum++
        result[i] = value
      }, err => {
        settledNum++
        result[i] = err
      }).finally(() => {
        if (settledNum === array.length) {
          resolve(result)
        }
      })
    }
  })
}
// 返回第一个settled（已经结束）的方法的状态
MyPromise.race = function (iterable) {
  const array = Array.from(iterable)
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      const element = array[i]
      MyPromise.resolve(element).then(resolve, reject)
    }
  })
}
// 返回第一个 fulfilled 的方法，如果没有，返回所有的 rejected 的 reason 的数组
MyPromise.any = function (iterable) {
  const array = Array.from(iterable)
  let rejectNum = 0
  const result = []
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < array.length; i++) {
      const element = array[i]
      MyPromise.resolve(element).then(resolve, err => {
        rejectNum++
        result[i](err)
        if (rejectNum === array.length) {
          reject(result)
        }
      })
    }
  })
}
MyPromise.try = function (func) {
  return new MyPromise((resolve, reject) => {
    resolve(func())
  })
}

// 测试
MyPromise.deferred = function () {
  var result = {}
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}
module.exports = MyPromise
