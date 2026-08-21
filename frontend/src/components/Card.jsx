import styles from './Card.module.css'

/**
 * 通用卡片容器（design.md C 组件族基础）
 * @param {boolean} hover 是否启用悬停上浮效果（默认 true）
 */
export default function Card({ children, className = '', hover = true, ...rest }) {
  return (
    <div
      className={`${styles.card} ${hover ? styles.hover : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
