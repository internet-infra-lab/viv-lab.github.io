import { useEffect, useState } from 'react'
import Icon from './Icon'
import styles from './BackToTop.module.css'

/**
 * 返回顶部（design.md C-17）：滚动超过一屏后淡入
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      className={styles.btn}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="返回顶部"
    >
      <Icon name="arrowUp" size={20} />
    </button>
  )
}
