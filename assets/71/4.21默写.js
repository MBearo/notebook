const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function MyPromise (executor) {
  this.satus = PENDING
  this.value = ''
  this.reason = ''
  this.onFulfilledFunc = []
  this.onRejectedFunc = []

  const resolve = value => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      this.onFulfilledFunc.forEach(fun => fun())
    }
  }

  const reject = reason => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      this.onRejectedFunc.forEach(fun => fun())
    }
  }

  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}
function resolvePromise (promise, x, resolve, reject) {
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          resolvePromise(promise, y, resolve, reject)
        }, r => {
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (error) {
      reject(error)
    }
  } else {
    resolve(x)
  }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
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
