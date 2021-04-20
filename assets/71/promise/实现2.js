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
    // if (value instanceof MyPromise) {
    //   return value.then(resolve, reject)
    // }
    if (this.status === PENDING) {
      this.value = value
      this.status = FULFILLED
      this.onFulfilledFunc.forEach(fn => fn())
    }
  }
  const reject = reason => {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED
      this.onRejectedFunc.forEach(fn => fn())
    }
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    console.log(error)
    reject(error)
  }
}

// 2.2.4 onFulfilled, onRejected 必须是异步
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // 返回新的promise
  const promise2 = new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    }
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
    // 异步的时候将回调存起来
    if (this.status === PENDING) {
      this.onFulfilledFunc.push(() => {
        onFulfilled(this.value)
      })
      this.onRejectedFunc.push(() => {
        onRejected(this.reason)
      })
    }
  })
  return promise2
}

// 测试

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
}).then(
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  }
)

// 继续实现链式调用
