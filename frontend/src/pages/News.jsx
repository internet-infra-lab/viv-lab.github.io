import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import NewsCard from '../components/NewsCard'
import Pagination from '../components/Pagination'
import Tag from '../components/Tag'
import Icon from '../components/Icon'
import assetUrl from '../utils/asset'
import news from '../data/news.json'
import { useT } from '../i18n/LangContext'
import styles from './News.module.css'

/** 新闻分类（数据值为中文）→ i18n key */
const CATEGORY_KEY = {
  科研成果: 'news.cat.research',
  人才培养: 'news.cat.talent',
  合作交流: 'news.cat.cooperation',
  学术交流: 'news.cat.academic',
}

const PAGE_SIZE = 10

/** 分类页签：从数据动态推导（含「全部」） */
function buildCategories() {
  const set = new Set(news.map((n) => n.category))
  return ['全部', ...set]
}

export default function News() {
  const t = useT()
  const [category, setCategory] = useState('全部')
  const categoryLabel = (value) =>
    value === '全部' ? t('common.all') : CATEGORY_KEY[value] ? t(CATEGORY_KEY[value]) : value
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
      <PageHeader title={t('news.title')} en="News" desc={t('news.desc')} />

      <div className="container section-pad">
        {/* ---- 分类页签 ---- */}
        <div className={styles.tabs} role="tablist" aria-label={t('news.tabs')}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              className={`${styles.tab} ${category === c ? styles.tabActive : ''}`}
              onClick={() => switchCategory(c)}
            >
              {categoryLabel(c)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className={styles.empty}>{t('news.empty')}</p>
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
                    <Tag variant="primary">{categoryLabel(featured.category)}</Tag>
                    <span className={styles.featuredDate}>{featured.date}</span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featured.title}</h2>
                  <p className={styles.featuredSummary}>{featured.summary}</p>
                  <span className={styles.featuredMore}>
                    {t('common.readMore')}
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
