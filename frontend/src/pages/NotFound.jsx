import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className="container section-pad">
      <div className={styles.wrap}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>页面未找到</h1>
        <p className={styles.desc}>您访问的页面可能已被移动或删除。</p>
        <div className={styles.actions}>
          <Link to="/" className={styles.btnPrimary}>
            返回首页
          </Link>
          <Link to="/publications" className={styles.btnGhost}>
            浏览学术论文
          </Link>
          <Link to="/news" className={styles.btnGhost}>
            查看新闻动态
          </Link>
        </div>
      </div>
    </div>
  )
}
