import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 路由切换时回到页面顶部（仅路径变化时触发）
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
