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
    if (value instanceof MyPromise) {
      return value.then(resolve, reject)
    }
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      this.onFulfilledFunc.forEach(fn => fn())
    }
  }
  const reject = reason => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      this.onRejectedFunc.forEach(fn => fn())
    }
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}
function resolvePromise (promise, x, resolve, reject) {
  if (promise === x) {
    throw new TypeError('Chaining cycle detected fro promise #<Promise>')
  }
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    let called = false
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        // 如果then是普通值就原路返回
        resolve(x)
        // if (called) return
        // called = true
        // reject(x)
      }
    } catch (error) {
    // 这里也要加
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 忘了给默认值了
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
  onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
      setTimeout(() => {
        try {
          const x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
    if (this.status === REJECTED) {
      setTimeout(() => {
        try {
          const x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        } catch (error) {
          reject(error)
        }
      })
    }
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
MyPromise.deferred = function () {
  var result = {}
  result.promise = new MyPromise(function (resolve, reject) {
    result.resolve = resolve
    result.reject = reject
  })

  return result
}
module.exports = MyPromise
