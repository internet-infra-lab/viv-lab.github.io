import Icon from './Icon'
import styles from './EmptyState.module.css'

/**
 * 空态 / 结果态（design.md C-14）
 */
export default function EmptyState({ title, desc, actionLabel, onAction }) {
  return (
    <div className={styles.empty}>
      <div className={styles.illustration} aria-hidden="true">
        <Icon name="search" size={44} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {desc && <p className={styles.desc}>{desc}</p>}
      {onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel || '重置筛选'}
        </button>
      )}
    </div>
  )
}
