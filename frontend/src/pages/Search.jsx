import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import { HOT_KEYWORDS, SEARCH_GROUPS, searchAll } from '../utils/search'
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
      <PageHeader
        title="站内搜索"
        en="Search"
        desc="一次检索全站的学术成果、新闻动态、团队成员与研究方向，结果按类别分组展示。"
      />

      <div className="container section-pad">
        <form className={styles.searchForm} onSubmit={submit} role="search">
          <Icon name="search" size={20} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.searchInput}
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="搜索论文、作者、新闻、成员、研究方向，多个关键词用空格分隔"
            aria-label="全站搜索"
          />
          <button type="submit" className={styles.searchBtn}>
            搜索
          </button>
        </form>

        {/* ---- 空查询：热门关键词 + 分类概览 ---- */}
        {!query.trim() && (
          <div className={styles.placeholder}>
            <div className={styles.hotBlock}>
              <h2 className={styles.hotTitle}>热门关键词</h2>
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
              <h2 className={styles.hotTitle}>可检索范围</h2>
              <ul className={styles.scopeList}>
                {SEARCH_GROUPS.map((group) => (
                  <li key={group.type} className={styles.scopeItem}>
                    <span className={styles.scopeIcon}>
                      <Icon name={group.icon} size={18} />
                    </span>
                    {group.label}
                  </li>
                ))}
              </ul>
              <p className={styles.hotHint}>
                检索支持中文与英文关键词；多个关键词需同时命中，「{'"'}数据互操作 授权{'"'}」这类组合更精确。
              </p>
            </div>
          </div>
        )}

        {/* ---- 有查询：结果统计 + 分类页签 ---- */}
        {query.trim() && (
          <>
            <div className={styles.summaryRow}>
              <p className={styles.summary}>
                找到 <strong>{total}</strong> 条与「{query.trim()}」相关的内容
              </p>
              {total > 0 && (
                <div className={styles.tabs} role="tablist" aria-label="结果分类">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeType === ALL}
                    className={`${styles.tab} ${activeType === ALL ? styles.tabActive : ''}`}
                    onClick={() => switchType(ALL)}
                  >
                    全部
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
                        {group.label}
                        <span className={styles.tabCount}>{count}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {total === 0 && (
              <EmptyState
                title={`没有找到与「${query.trim()}」相关的内容`}
                desc="试试更换关键词、减少限定词，或点击下方热门关键词。"
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
                <section key={group.type} className={styles.group} aria-label={group.label}>
                  <div className={styles.groupHead}>
                    <h2 className={styles.groupTitle}>
                      <span className={styles.groupIcon}>
                        <Icon name={group.icon} size={16} />
                      </span>
                      {group.label}
                      <span className={styles.groupCount}>
                        {group.items.length} {group.unit}
                      </span>
                    </h2>
                    {rest > 0 && (
                      <button
                        type="button"
                        className={styles.moreBtn}
                        onClick={() => switchType(group.type)}
                      >
                        查看全部 {group.items.length} {group.unit}
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
