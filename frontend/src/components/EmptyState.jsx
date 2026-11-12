import Icon from './Icon'
import { useT } from '../i18n/LangContext'
import styles from './EmptyState.module.css'

/**
 * 空态 / 结果态（design.md C-14）
 */
export default function EmptyState({ title, desc, actionLabel, onAction }) {
  const t = useT()
  return (
    <div className={styles.empty}>
      <div className={styles.illustration} aria-hidden="true">
        <Icon name="search" size={44} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      {desc && <p className={styles.desc}>{desc}</p>}
      {onAction && (
        <button type="button" className={styles.action} onClick={onAction}>
          {actionLabel || t('common.viewAll')}
        </button>
      )}
    </div>
  )
}
