const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function MyPromise(executor) {
  this.status = PENDING
  this.value = ''
  this.reason = ''
  this.onFulfilledFunc = []
  this.onRejectedFunc = []

  const resolve = (value) => {
    // 只能从 pending 来到 fulfilled
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      this.onFulfilledFunc.forEach(fun => fun())
    }
  }
  const reject = (reason) => {
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

function resolvePromise(promise, x, resolve, reject) {
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    resolve(x)
  } else {
    // 这里不对
    reject(x)
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
      const x = onFulfilled(this.value)
      resolvePromise(promise2, x, resolve, reject)
    }
    if (this.status === REJECTED) {
      const x = onRejected(this.reason)
      resolvePromise(promise2, x, resolve, reject)
    }
    if (this.status === PENDING) {
      this.onFulfilledFunc.push(() => {
        setTimeout(() => {
          const x = onFulfilled(this.value)
          resolvePromise(promise2, x, resolve, reject)
        })
      })
      this.onRejectedFunc.push(() => {
        setTimeout(() => {
          const x = onRejected(this.reason)
          resolvePromise(promise2, x, resolve, reject)
        })
      })
    }
  })
  return promise2
}

// 写下来全靠记忆，根本不理解
// resolvePromise 没记住，也不懂
// settimeout 加不加也一脸懵逼

/**
 * @todo then 中啥也不写，值要透传
 * @todo onFulfilled 返回一个 promise
 * @todo onFulfilled 和 onRejected 如果有报错
 * @todo onFulfilled 返回当前 promise 本身
 * @todo onFulfilled 返回的 promise 里还有 promise
 */

function MyPromise2(executor) {
  this.status = PENDING
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
function resolvePromise(promise, x, resolve, reject) {
  //x不是普通值
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then
      // 判断有没有then
      if (typeof then === 'function') {
        then.call(x, y => {
          
        }, r => {

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
MyPromise2.prototype.then = function (onFulfilled, onRejected) {
  // 这里有问题，判断 onFulfilled onRejected 是不是函数，而不是判断有没有
  onFulfilled ? onFulfilled : data => data
  onRejected ? onRejected : error => { throw error }
  const promise2 = new MyPromise2((resolve, reject) => {
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
            onFulfilled(this.value)
          } catch (error) {
            reject(error)
          }
        })
      })
      this.onRejectedFunc.push(() => {
        setTimeout(() => {
          try {
            onRejected(this.reason)
          } catch (error) {
            reject(error)
          }
        })
      })
    }
  })
  return promise2
}
