const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const log = content => console.log(content)

const subFlow = createFlow([() => delay(1000).then(() => log('c'))])

createFlow([
  () => log('a'),
  () => log('b'),
  subFlow,
  [() => delay(2000).then(() => log('d')), () => log('e')]
]).run(() => {
  console.log('done')
})
function createFlow (array) {
  array = array.flat()
  return {
    async run (cb = () => {}) {
      for (let i = 0; i < array.length; i++) {
        typeof array[i] === 'function'
          ? await array[i]()
          : await array[i].run()
      }
      cb()
    }
  }
}
