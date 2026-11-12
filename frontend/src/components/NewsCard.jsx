import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from './Card'
import Icon from './Icon'
import Tag from './Tag'
import assetUrl from '../utils/asset'
import { useT } from '../i18n/LangContext'
import styles from './NewsCard.module.css'

/** 新闻分类（数据值为中文）→ i18n key */
const CATEGORY_KEY = {
  科研成果: 'news.cat.research',
  人才培养: 'news.cat.talent',
  合作交流: 'news.cat.cooperation',
  学术交流: 'news.cat.academic',
}

/**
 * 新闻卡片（design.md C-10）
 * compact 模式：仅标题 + 日期（用于首页侧栏）
 * 封面图：本地图片，加载失败时回退为渐变占位 + 分类图标
 */
export default function NewsCard({ item, compact = false }) {
  const [imgFailed, setImgFailed] = useState(false)

  if (compact) {
    return (
      <Link to={`/news/${item.id}`} className={styles.compact}>
        <span className={styles.compactDate}>{item.date}</span>
        <span className={styles.compactTitle}>{item.title}</span>
        <Icon name="arrowRight" size={14} className={styles.compactArrow} />
      </Link>
    )
  }

  return (
    <Card className={styles.card}>
      <Link to={`/news/${item.id}`} className={styles.link}>
        <div className={styles.cover}>
          {item.cover && !imgFailed ? (
            <img
              src={assetUrl(item.cover)}
              alt={item.title}
              loading="lazy"
              className={`${styles.coverImg}${
                item.coverFit === 'contain' ? ` ${styles.coverContain}` : ''
              }`}
              onError={() => setImgFailed(true)}
            />
          ) : (
            <Icon name="flask" size={40} className={styles.coverIcon} />
          )}
        </div>
        <div className={styles.body}>
          <div className={styles.metaRow}>
            <Tag variant="neutral">{categoryLabel}</Tag>
            <span className={styles.date}>{item.date}</span>
          </div>
          <h3 className={styles.title}>{item.title}</h3>
          <p className={styles.summary}>{item.summary}</p>
        </div>
      </Link>
    </Card>
  )
}
