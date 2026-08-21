import Icon from './Icon'
import styles from './Pagination.module.css'

/**
 * 分页（design.md C-20）
 */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    // 简单策略：页数多时省略中间
    if (totalPages <= 7 || i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <nav className={styles.pagination} aria-label="分页导航">
      <button
        type="button"
        className={styles.arrow}
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="上一页"
      >
        <Icon name="chevronLeft" size={16} />
      </button>

      {pages.map((p, idx) =>
        p === '…' ? (
          <span key={`e-${idx}`} className={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={`${styles.page} ${p === page ? styles.pageActive : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        className={styles.arrow}
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="下一页"
      >
        <Icon name="chevronRight" size={16} />
      </button>
    </nav>
  )
}
