import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import NewsCard from '../components/NewsCard'
import Pagination from '../components/Pagination'
import Tag from '../components/Tag'
import Icon from '../components/Icon'
import assetUrl from '../utils/asset'
import news from '../data/news.json'
import styles from './News.module.css'

const PAGE_SIZE = 10

/** 分类页签：从数据动态推导（含「全部」） */
function buildCategories() {
  const set = new Set(news.map((n) => n.category))
  return ['全部', ...set]
}

export default function News() {
  const [category, setCategory] = useState('全部')
  const [page, setPage] = useState(1)

  const CATEGORIES = useMemo(buildCategories, [])

  const filtered = useMemo(() => {
    const list = category === '全部' ? news : news.filter((n) => n.category === category)
    return [...list].sort((a, b) => b.date.localeCompare(a.date))
  }, [category])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * PAGE_SIZE
  const featured = filtered[start]
  const gridItems = filtered.slice(start + 1, start + PAGE_SIZE)

  const switchCategory = (c) => {
    setCategory(c)
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="新闻动态"
        en="News"
        desc="实验室最新动态、学术活动、获奖荣誉与媒体报道。"
      />

      <div className="container section-pad">
        {/* ---- 分类页签 ---- */}
        <div className={styles.tabs} role="tablist" aria-label="新闻分类">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              className={`${styles.tab} ${category === c ? styles.tabActive : ''}`}
              onClick={() => switchCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>该分类暂无内容</p>
        ) : (
          <>
            {/* ---- 首条大版式 ---- */}
            {featured && (
              <Link to={`/news/${featured.id}`} className={styles.featured}>
                <div className={styles.featuredCover} aria-hidden="true">
                  {featured.cover ? (
                    <img
                      src={assetUrl(featured.cover)}
                      alt=""
                      className={`${styles.featuredCoverImg}${
                        featured.coverFit === 'contain' ? ` ${styles.featuredCoverContain}` : ''
                      }`}
                      loading="lazy"
                    />
                  ) : (
                    <Icon name="flask" size={56} />
                  )}
                </div>
                <div className={styles.featuredBody}>
                  <div className={styles.featuredMeta}>
                    <Tag variant="primary">{featured.category}</Tag>
                    <span className={styles.featuredDate}>{featured.date}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  <p className={styles.featuredSummary}>{featured.summary}</p>
                  <span className={styles.featuredMore}>
                    阅读全文
                    <Icon name="arrowRight" size={16} />
                  </span>
                </div>
              </Link>
            )}

            {/* ---- 列表网格 ---- */}
            <div className={styles.grid}>
              {gridItems.map((n) => (
                <NewsCard key={n.id} item={n} />
              ))}
            </div>

            <Pagination
              page={safePage}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </div>
    </>
  )
}
