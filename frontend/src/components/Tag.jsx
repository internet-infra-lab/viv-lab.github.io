import styles from './Tag.module.css'

/**
 * 标签（design.md C-04）：primary / neutral / success / warning
 */
export default function Tag({ children, variant = 'primary', className = '' }) {
  return <span className={`${styles.tag} ${styles[variant]} ${className}`}>{children}</span>
}
