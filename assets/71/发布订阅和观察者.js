/**
 * @todo 取消订阅
 */
// https://zhuanlan.zhihu.com/p/60324936
// 订阅一个事件，当事件执行的的时候触发回调
class Pubsub {
  constructor () {
    this.subscribers = {}
  }

  on (key, callback) {
    if (this.subscribers[key]) {
      this.subscribers[key].push(callback)
    } else {
      this.subscribers[key] = [callback]
    }
  }

  emit (key, ...args) {
    if (this.subscribers[key]) {
      this.subscribers[key].forEach(callback => callback(args))
    }
  }
}
// 被观察者变化时，通知观察者
class Subject {
  constructor () {
    this.observers = []
  }

  add (observer) {
    this.observers.push(observer)
  }

  notify (...args) {
    this.observers.forEach(observer => observer.update(...args))
  }
}
class Observer {
  update (...args) {
    console.log(args)
  }
}
