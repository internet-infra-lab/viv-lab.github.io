import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 路由切换后的滚动定位
 * - 带 #锚点（如 /join-us#contact）时滚动到目标元素，便于跨页跳转到指定板块
 * - 其余情况回到页面顶部
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
