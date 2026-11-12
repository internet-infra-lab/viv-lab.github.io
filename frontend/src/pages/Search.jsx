import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import { HOT_KEYWORDS, SEARCH_GROUPS, searchAll } from '../utils/search'
import { useT } from '../i18n/LangContext'
import styles from './Search.module.css'

const ALL = 'all'

/** 全量结果中每个分类默认展示的条数（其余通过分类页签查看） */
const PREVIEW_LIMIT = 5

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** 检索词高亮：命中片段用 <mark> 包裹（正则只有一个捕获组，奇数下标即命中） */
function Highlight({ text, tokens }) {
  const source = String(text || '')
  const terms = (tokens || []).filter(Boolean)
  if (!source || terms.length === 0) return source

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi')
  const parts = source.split(pattern)
  if (parts.length === 1) return source

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className={styles.mark}>
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

/** 单条搜索结果：站内结果用 Link，外部主页结果用 <a>（新窗口打开） */
function ResultItem({ item, tokens }) {
  const body = (
    <>
      <div className={styles.itemHead}>
        <h3 className={styles.itemTitle}>
          <Highlight text={item.title} tokens={tokens} />
        </h3>
        {item.badge && <span className={styles.itemBadge}>{item.badge}</span>}
      </div>
      {item.subtitle && (
        <p className={styles.itemSubtitle}>
          <Highlight text={item.subtitle} tokens={tokens} />
        </p>
      )}
      <p className={styles.itemMeta}>
        {item.meta}
        {item.external && (
          <>
            {' '}
            <Icon name="external" size={12} />
          </>
        )}
      </p>
    </>
  )

  if (item.external) {
    return (
      <a
        className={styles.result}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    )
  }

  return (
    <Link className={styles.result} to={item.href}>
      {body}
    </Link>
  )
}

export default function Search() {
  const t = useT()
  const groupLabel = (type) => t(`search.group.${type}`)
  const groupUnit = (type) => t(`search.unit.${type}`)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const activeType = searchParams.get('type') || ALL

  const [draft, setDraft] = useState(query)
  const inputRef = useRef(null)

  // 地址栏变化（如顶部导航提交、点击热门关键词）时同步输入框
  useEffect(() => {
    setDraft(query)
  }, [query])

  const { tokens, total, groups } = useMemo(() => searchAll(query), [query])

  const countOf = (type) => groups.find((g) => g.type === type)?.items.length || 0
  const visibleGroups =
    activeType === ALL ? groups : groups.filter((g) => g.type === activeType)

  const submit = (e) => {
    e.preventDefault()
    const q = draft.trim()
    const next = new URLSearchParams()
    if (q) next.set('q', q)
    if (activeType !== ALL) next.set('type', activeType)
    setSearchParams(next)
  }

  const switchType = (type) => {
    const next = new URLSearchParams(searchParams)
    if (type === ALL) next.delete('type')
    else next.set('type', type)
    setSearchParams(next)
  }

  const searchFor = (keyword) => {
    const next = new URLSearchParams()
    next.set('q', keyword)
    setSearchParams(next)
  }

  return (
    <>
      <PageHeader title={t('search.title')} en="Search" desc={t('search.headerDesc')} />

      <div className="container section-pad">
        <form className={styles.searchForm} onSubmit={submit} role="search">
          <Icon name="search" size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.searchInput}
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.aria')}
          />
          <button type="submit" className={styles.searchBtn}>
            {t('search.button')}
          </button>
        </form>

        {/* ---- 空查询：热门关键词 + 分类概览 ---- */}
        {!query.trim() && (
          <div className={styles.placeholder}>
            <div className={styles.hotBlock}>
              <h2 className={styles.hotTitle}>{t('search.hot')}</h2>
              <div className={styles.hotTags}>
                {HOT_KEYWORDS.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    className={styles.hotTag}
                    onClick={() => searchFor(keyword)}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.scopeBlock}>
              <h2 className={styles.hotTitle}>{t('search.scope')}</h2>
              <ul className={styles.scopeList}>
                {SEARCH_GROUPS.map((group) => (
                  <li key={group.type} className={styles.scopeItem}>
                    <span className={styles.scopeIcon}>
                      <Icon name={group.icon} size={18} />
                    </span>
                    {groupLabel(group.type)}
                  </li>
                ))}
              </ul>
              <p className={styles.hotHint}>{t('search.hint')}</p>
            </div>
          </div>
        )}

        {/* ---- 有查询：结果统计 + 分类页签 ---- */}
        {query.trim() && (
          <>
            <div className={styles.summaryRow}>
              <p className={styles.summary}>
                {t('search.summary', { n: total, q: query.trim() })}
              </p>
              {total > 0 && (
                <div className={styles.tabs} role="tablist" aria-label={t('search.tabs')}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeType === ALL}
                    className={`${styles.tab} ${activeType === ALL ? styles.tabActive : ''}`}
                    onClick={() => switchType(ALL)}
                  >
                    {t('common.all')}
                    <span className={styles.tabCount}>{total}</span>
                  </button>
                  {SEARCH_GROUPS.map((group) => {
                    const count = countOf(group.type)
                    if (count === 0) return null
                    return (
                      <button
                        key={group.type}
                        type="button"
                        role="tab"
                        aria-selected={activeType === group.type}
                        className={`${styles.tab} ${
                          activeType === group.type ? styles.tabActive : ''
                        }`}
                        onClick={() => switchType(group.type)}
                      >
                        <Icon name={group.icon} size={14} />
                        {groupLabel(group.type)}
                        <span className={styles.tabCount}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {total === 0 && (
              <EmptyState
                title={t('search.emptyTitle', { q: query.trim() })}
                desc={t('search.emptyDesc')}
              />
            )}

            {total === 0 && (
              <div className={styles.hotTags}>
                {HOT_KEYWORDS.map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    className={styles.hotTag}
                    onClick={() => searchFor(keyword)}
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            )}

            {visibleGroups.map((group) => {
              const expanded = activeType === group.type
              const shown = expanded ? group.items : group.items.slice(0, PREVIEW_LIMIT)
              const rest = group.items.length - shown.length
              return (
                <section key={group.type} className={styles.group} aria-label={groupLabel(group.type)}>
                  <div className={styles.groupHead}>
                    <h2 className={styles.groupTitle}>
                      <span className={styles.groupIcon}>
                        <Icon name={group.icon} size={16} />
                      </span>
                      {groupLabel(group.type)}
                      <span className={styles.groupCount}>
                        {group.items.length} {groupUnit(group.type)}
                      </span>
                    </h2>
                    {rest > 0 && (
                      <button
                        type="button"
                        className={styles.moreBtn}
                        onClick={() => switchType(group.type)}
                      >
                        {t('search.viewAll', { n: group.items.length, unit: groupUnit(group.type) })}
                        <Icon name="arrowRight" size={14} />
                      </button>
                    )}
                  </div>
                  <ul className={styles.resultList}>
                    {shown.map((item) => (
                      <li key={`${item.type}-${item.id}`}>
                        <ResultItem item={item} tokens={tokens} />
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </>
        )}
      </div>
    </>
  )
}
