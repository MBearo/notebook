/* eslint-disable camelcase */
// 并发控制
var urls = [
  'https://www.kkkk1000.com/images/getImgData/getImgDatadata.jpg',
  'https://www.kkkk1000.com/images/getImgData/gray.gif',
  'https://www.kkkk1000.com/images/getImgData/Particle.gif',
  'https://www.kkkk1000.com/images/getImgData/arithmetic.png',
  'https://www.kkkk1000.com/images/getImgData/arithmetic2.gif',
  'https://www.kkkk1000.com/images/getImgData/getImgDataError.jpg',
  'https://www.kkkk1000.com/images/getImgData/arithmetic.gif',
  'https://www.kkkk1000.com/images/wxQrCode2.png'
]

function loadImg (url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function () {
      console.log('一张图片加载完成')
      resolve()
    }
    img.onerror = reject
    img.src = url
  })
};

function loadLimit (urls, handler, limit) {
  const urls_copy = [...urls]
  let promise_array = []
  promise_array = urls_copy.splice(0, limit).map((url, index) => handler(url).then(() => index))
  urls_copy.reduce(async (pre_promise, url) => {
    const res = await pre_promise
    console.log('res', res)
    if (res !== undefined) {
      promise_array[res] = handler(url).then(() => res)
    }
    return Promise.race(promise_array)
  }, Promise.resolve())
}

loadLimit(urls, loadImg, 3)
