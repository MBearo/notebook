const toProxy = new WeakMap() // {原对象:代理过的对象}
const toRaw = new WeakMap()// {代理过的对象:原对象}
const activeEffectStacks = []
function isObject (val) {
  return typeof val === 'object' && val !== null
}
function hasOwn (target, key) {
  return Object.prototype.hasOwnProperty.call(target, key)
}
function reactive (target) {
  return createReactiveObject(target)
}
// 创建响应式对象
function createReactiveObject (target) {
  if (!isObject(target)) {
    return target
  }
  const proxy = toProxy.get(target)
  // 如果已经代理过了，就把代理过的结果返回
  // 防止代理代理过后的对象
  if (proxy) {
    return proxy
  }
  // 防止代理过得对象被再次代理
  if (toRaw.has(target)) {
    return target
  }
  const baseHandler = {
    get (target, key, receiver) {
      console.log('get', target, key)
      const result = Reflect.get(target, key, receiver)
      // 如果是a.b.c这种深层级，判断值是否是对象，如果是，就继续代理
      // 相当于递归，但是是在get的时候才递归，而不是像2.0那样先把所有的都挂上observable
      return isObject(result) ? reactive(result) : result
    },
    set (target, key, value, receiver) {
      console.log('set', target, key, value)
      const hadKey = hasOwn(target, key)
      const oldValue = target[value]
      const result = Reflect.set(target, key, value, receiver)
      // 如果之前没有这个属性
      if (!hadKey) {
        console.log('新增属性', key, value)
      } else if (oldValue !== value) { // 为了屏蔽无意义的修改
        console.log('修改属性', key, value)
      }

      return result
    },
    deleteProperty (target, key, receiver) {
      const result = Reflect.deleteProperty(target, key, receiver)
      return result
    }
  }
  const observed = new Proxy(target, baseHandler)
  toProxy.set(target, observed)
  toRaw.set(observed, target)
  return observed
}
function effect (fn) {
  const effect = createReactiveEffect(fn)
  // 默认执行一次
  effect()
}
function createReactiveEffect (fn) {
  const effect = function () {
    return run(effect, fn)
  }
  return effect
}
function run (effect, fn) {
  activeEffectStacks.push(effect)
  fn()
}
const proxy = reactive({
  a: {
    b: {
      c: 1111
    }
  }
})
effect(() => {
  console.log(proxy.a.b.c)
})
proxy.a.b.c = 10
