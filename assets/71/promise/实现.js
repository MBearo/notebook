// 实现
function MyPromise (executor) {
  this.status = 'pending'
  this.value = ''
  this.reason = ''
  this.onFulfilledFunc = []
  this.onRejectedFunc = []
  const resolve = value => {
    // 这里没太懂
    // if (value instanceof MyPromise) {
    //   return value.then(resolve, reject)
    // }
    if (this.status === 'pending') {
      setTimeout(() => {
        this.value = value
        this.status = 'fulfilled'
        this.onFulfilledFunc.forEach(fn => fn())
      })
    }
  }
  const reject = reason => {
    if (this.status === 'pending') {
      setTimeout(() => {
        this.reason = reason
        this.status = 'rejected'
        this.onRejectedFunc.forEach(fn => fn())
      })
    }
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
  onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }
  // 返回新的promise
  if (this.status === 'fulfilled') {
    onFulfilled(this.value)
  }
  if (this.status === 'rejected') {
    onRejected(this.reason)
  }
  // 异步的时候将回调存起来
  if (this.status === 'pending') {
    this.onFulfilledFunc.push(() => onFulfilled(this.value))
    this.onRejectedFunc.push(() => onRejected(this.reason))
  }
}

// 测试

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})
promise.then(val => console.log('then', val))
promise.then(val => console.log('then', val))
promise.then(val => console.log('then', val))
