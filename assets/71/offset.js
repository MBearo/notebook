/**
 * 可以考虑元素的 display 为 none 的情况
 * 可以考虑元素在 iframe 中的情况
 */
export function offset (ele) {
  if (window.getComputedStyle(ele).display === 'none') {
    return {
      x: 0,
      y: 0
    }
  }
  const docElement = ele.ownerDocument.documentElement
  const result = ele.getBoundingClientRect() // 距离视窗的坐标
  return {
    x: window.pageXOffset + result.left - docElement.clientLeft,
    y: window.pageYOffset + result.top - docElement.clientTop // pageYOffset 和 scrollY 值相同
  }
}
