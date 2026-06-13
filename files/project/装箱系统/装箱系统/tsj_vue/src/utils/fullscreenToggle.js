/**
 * 切换指定元素的全屏状态（进入 / 退出）。兼容常见浏览器前缀。
 * @param {HTMLElement | null} el
 */
export function toggleFullscreenForElement(el) {
  if (!el) return
  const doc = document
  const active =
    doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement
  try {
    if (active === el) {
      if (doc.exitFullscreen) doc.exitFullscreen()
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen()
      else if (doc.msExitFullscreen) doc.msExitFullscreen()
    } else {
      if (el.requestFullscreen) el.requestFullscreen()
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
      else if (el.msRequestFullscreen) el.msRequestFullscreen()
    }
  } catch {
    // 部分嵌入环境或权限策略下可能抛错，静默忽略
  }
}
