import { Link } from 'react-router-dom'
import Icon from './Icon'
import styles from './RecruitBanner.module.css'

/**
 * 招生招聘横幅（design.md C-15，全站唯一暖色强调区块）
 */
export default function RecruitBanner({ title, desc, cta }) {
  return (
    <section className={styles.banner}>
      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.desc}>{desc}</p>
      </div>
      <Link to="/join-us" className={styles.cta}>
        {cta || '查看招生信息'}
        <Icon name="arrowRight" size={18} />
      </Link>
    </section>
  )
}
