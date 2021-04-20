// 实现
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function MyPromise (executor) {
  this.status = PENDING
  this.value = ''
  this.reason = ''
  const resolve = value => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
    }
  }
  const reject = reason => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.reason = reason
    }
  }
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  if (this.status === FULFILLED) {
    onFulfilled(this.value)
  }
  if (this.status === REJECTED) {
    onRejected(this.reason)
  }
}

new MyPromise((resolve, reject) => {
  resolve(1111)
}).then(v => {
  console.log(v + 2)
}, err => {
  console.log(err)
})

// 但是异步有问题
// 下面解决异步问题
new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1111)
  })
}).then(v => {
  console.log(v + 2)
}, err => {
  console.log(err)
})
