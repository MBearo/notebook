let timer
function debounce(callback, time) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    callback()
  }, time)
}
// 上面这个问题很大
// 我们需要返回一个函数，而不是立即执行
function debounce(func, wait) {
  let timer
  return (...arg) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func(...arg)
    }, wait)
  }
}
// 有一个问题是，为什么 timer 可以共享

/**
 * function onScroll_1() {
 *    console.log('执行滚动处理函数啦');  
 * }
 * window.addEventListener('resize',debounce(onScroll_1, 1000));
 * 
 * 普通写是 addEventListener 第二个参数是一个未执行的函数，但是这里 debounce 执行了，返回了个未执行的函数
 * 这样接下来 addEventListener 触发的回调都是 debounce 返回的那个函数，所有闭包是同一个 timer
 * 妙啊
 */

// 上文回调的 this 指向有问题，this 会指向window
function debounce(func, wait) {
  let timer
  return function (...arg) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, arg)
    }, wait)
  }
}

// 加一个第一次立即触发的功能
function debounce(func, wait, immediate) {
  let timer
  return function (...arg) {
    if (timer) clearTimeout(timer)
    //第一次立即执行后，就不应该再有延迟再次执行这个函数
    if (immediate && (!timer)) {
      timer = 1
      func.apply(this, arg)
    } else {
      timer = setTimeout(() => {
        func.apply(this, arg)
      }, wait)
    }
  }
}

/**
 * @leading default: false
 * @trailing default: true
 * @maxWait default: false
 */

// 如果 leading trailing 都为 false，那么就不触发了
// 如果 leading trailing 都为 true，那么 leading 出发的是 上一次 trailing 触发的

