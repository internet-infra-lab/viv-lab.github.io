import { Link } from 'react-router-dom'
import Icon from './Icon'
import styles from './Section.module.css'

/**
 * 页面板块容器（含标题区 + 可选「查看全部」链接）
 */
export default function Section({
  title,
  en,
  subtitle,
  actionLabel,
  actionTo,
  index,
  children,
  className = '',
}) {
  return (
    <section className={`${styles.section} ${className}`}>
      <div className={styles.header}>
        <div className={styles.titles}>
          {index && <span className={styles.index}>{index}</span>}
          <h2 className={styles.title}>{title}</h2>
          {en && <span className={styles.en}>{en}</span>}
        </div>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {actionTo && (
          <Link to={actionTo} className={styles.action}>
            {actionLabel || '查看全部'}
            <Icon name="arrowRight" size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
