setTimeout(_ => {
  console.log(1111)
})
Promise.resolve().then(_ => {
  console.log(2)
})
process.nextTick(_ => {
  console.log(3)
})
