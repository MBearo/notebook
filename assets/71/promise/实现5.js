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
    if (this.status === FULFILLED) {
      // 2.2.2
      // 2.2.4
      setTimeout(() => {
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
    if (this.status === REJECTED) {
      // 2.2.3
      setTimeout(() => {
        try {
          const x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
    // 异步的时候将回调存起来
    if (this.status === PENDING) {
      this.onFulfilledFunc.push(() => {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
      this.onRejectedFunc.push(() => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      })
    }
  })
  return promise2
}

// 遇到这种情况，resolve 里是一个 promise，那么就需要
// if (value instanceof MyPromise) {return value.then(resolve, reject)}
var p1 = new MyPromise(function (resolve, reject) {
  setTimeout(function () {
    resolve('ok')
  }, 2000)
})
var p2 = new MyPromise(function (resolve, reject) {
  resolve(p1) // resolve了一个promise
})

p2.then(function (res) {
  console.log(res)
})
console.log(p1)
console.log(p2)
// Promise { <pending> }
// Promise { <pending> }
// “ok"

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
