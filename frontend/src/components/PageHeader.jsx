import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../config/nav'
import styles from './PageHeader.module.css'

/**
 * 内页标题区（章节入口风格，非传统横幅）
 * 结构：章节编号（01 ——）/ 主标题 / 英文副题 / 一句话描述
 * 编号按全站导航顺序（config/nav.js）自动推导，排除首页后从 01 起，与导航栏目一致。
 */
const SECTION_ITEMS = NAV_ITEMS.filter((item) => item.path !== '/')

export default function PageHeader({ title, en, desc }) {
  const { pathname } = useLocation()

  // 按路径匹配所属导航栏目（含详情页，如 /research/:id 归属「研究内容」）
  const match = SECTION_ITEMS.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  )
  const index = match
    ? String(SECTION_ITEMS.indexOf(match) + 1).padStart(2, '0')
    : ''

  return (
    <div className={styles.header}>
      <div className={`${styles.inner} container`}>
        {index && <span className={styles.index}>{index}</span>}
        <h1 className={styles.title}>{title}</h1>
        {en && <span className={styles.en}>{en}</span>}
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
    </div>
  )
}
