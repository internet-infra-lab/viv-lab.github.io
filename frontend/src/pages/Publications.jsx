import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import PublicationCard from '../components/PublicationCard'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import papers from '../data/papers.json'
import directions from '../data/directions.json'
import styles from './Publications.module.css'

const PAGE_SIZE = 10

const TYPES = ['全部', '期刊', '会议', '专利']

export default function Publications() {
  const [searchParams, setSearchParams] = useSearchParams()

  const type = searchParams.get('type') || '全部'
  const year = searchParams.get('year') || '全部'
  const direction = searchParams.get('direction') || '全部'
  const sort = searchParams.get('sort') || 'desc'
  const q = searchParams.get('q') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const years = useMemo(
    () => [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a),
    [],
  )

  const updateParams = (patch) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(patch).forEach(([k, v]) => {
      if (v === '全部' || v === '' || (k === 'page' && v === 1)) next.delete(k)
      else next.set(k, String(v))
    })
    setSearchParams(next)
  }

  const filtered = useMemo(() => {
    let list = papers.filter((p) => {
      if (type !== '全部' && p.type !== type) return false
      if (year !== '全部' && p.year !== Number(year)) return false
      if (direction !== '全部' && !p.research_direction.includes(direction)) return false
      if (q) {
        const kw = q.toLowerCase()
        const hit =
          p.title.toLowerCase().includes(kw) ||
          p.abstract?.toLowerCase().includes(kw) ||
          p.keywords.some((k) => k.toLowerCase().includes(kw))
        if (!hit) return false
      }
      return true
    })
    list = [...list].sort((a, b) =>
      sort === 'asc' ? a.year - b.year : b.year - a.year,
    )
    return list
  }, [type, year, direction, sort, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <>
      <PageHeader
        title="学术论文"
        en="Publications"
        desc="实验室论文与专利成果库，可按类型、年份与研究方向检索。"
      />

      <div className="container section-pad">
        {/* ---- 筛选栏 ---- */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>类型</span>
            <div className={styles.typeTabs}>
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.typeTab} ${type === t ? styles.typeTabActive : ''}`}
                  onClick={() => updateParams({ type: t, page: 1 })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selects}>
            <label className={styles.selectWrap}>
              <span className={styles.filterLabel}>年份</span>
              <span className={styles.selectBox}>
                <select
                  value={year}
                  onChange={(e) => updateParams({ year: e.target.value, page: 1 })}
                >
                  <option value="全部">全部年份</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={14} className={styles.selectIcon} />
              </span>
            </label>

            <label className={styles.selectWrap}>
              <span className={styles.filterLabel}>方向</span>
              <span className={styles.selectBox}>
                <select
                  value={direction}
                  onChange={(e) => updateParams({ direction: e.target.value, page: 1 })}
                >
                  <option value="全部">全部方向</option>
                  {directions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title}
                    </option>
                  ))}
                </select>
                <Icon name="chevronDown" size={14} className={styles.selectIcon} />
              </span>
            </label>

            <label className={styles.selectWrap}>
              <span className={styles.filterLabel}>排序</span>
              <span className={styles.selectBox}>
                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                >
                  <option value="desc">年份 新 → 旧</option>
                  <option value="asc">年份 旧 → 新</option>
                </select>
                <Icon name="chevronDown" size={14} className={styles.selectIcon} />
              </span>
            </label>
          </div>

          <span className={styles.resultCount}>
            共 {filtered.length} 篇
            {q && <span className={styles.resultQuery}>（搜索：{q}）</span>}
          </span>
        </div>

        {/* ---- 论文列表 ---- */}
        {pageItems.length > 0 ? (
          <div className={styles.list}>
            {pageItems.map((p) => (
              <PublicationCard key={p.id} paper={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="未找到匹配的论文"
            desc="请尝试调整筛选条件或搜索关键词。"
            actionLabel="重置筛选"
            onAction={() => setSearchParams({})}
          />
        )}

        <Pagination
          page={safePage}
          totalPages={totalPages}
          onChange={(p) => updateParams({ page: p })}
        />
      </div>
    </>
  )
}
