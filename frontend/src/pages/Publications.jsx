import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import PublicationCard from '../components/PublicationCard'
import Pagination from '../components/Pagination'
import EmptyState from '../components/EmptyState'
import Icon from '../components/Icon'
import papers from '../data/papers.json'
import directions from '../data/directions.json'
import { signaturesForQuery } from '../utils/authorNames'
import { getDirectionConfig } from '../config/researchDirections'
import { useLang, useT } from '../i18n/LangContext'
import styles from './Publications.module.css'

const PAGE_SIZE = 10

const TYPES = ['全部', '期刊', '会议', '专利']

/** 论文类型 → i18n key（数据值仍用中文，仅展示层翻译） */
const TYPE_KEY = { 期刊: 'pub.type.journal', 会议: 'pub.type.conference', 专利: 'pub.type.patent' }

export default function Publications() {
  const t = useT()
  const { lang } = useLang()
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
    const kw = q.toLowerCase()
    // 中文姓名检索时，同时匹配该成员的英文署名（如「李颖」→ Ying Li）
    const aliases = signaturesForQuery(q).map((n) => n.toLowerCase())
    let list = papers.filter((p) => {
      if (type !== '全部' && p.type !== type) return false
      if (year !== '全部' && p.year !== Number(year)) return false
      if (direction !== '全部' && !p.research_direction.includes(direction)) return false
      if (q) {
        const hit =
          p.title.toLowerCase().includes(kw) ||
          p.abstract?.toLowerCase().includes(kw) ||
          p.venue.toLowerCase().includes(kw) ||
          p.authors.some(
            (a) =>
              a.name.toLowerCase().includes(kw) ||
              aliases.some((alias) => alias.includes(a.name.toLowerCase())),
          ) ||
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
      <PageHeader title={t('pub.title')} en="Publications" desc={t('pub.desc')} />

      <div className="container section-pad">
        {/* ---- 筛选栏 ---- */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>{t('pub.filter.type')}</span>
            <div className={styles.typeTabs}>
              {TYPES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`${styles.typeTab} ${type === option ? styles.typeTabActive : ''}`}
                  onClick={() => updateParams({ type: option, page: 1 })}
                >
                  {TYPE_KEY[option] ? t(TYPE_KEY[option]) : t('common.all')}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.selects}>
            <label className={styles.selectWrap}>
              <span className={styles.filterLabel}>{t('pub.filter.year')}</span>
              <span className={styles.selectBox}>
                <select
                  value={year}
                  onChange={(e) => updateParams({ year: e.target.value, page: 1 })}
                >
                  <option value="全部">{t('pub.allYears')}</option>
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
              <span className={styles.filterLabel}>{t('pub.filter.direction')}</span>
              <span className={styles.selectBox}>
                <select
                  value={direction}
                  onChange={(e) => updateParams({ direction: e.target.value, page: 1 })}
                >
                  <option value="全部">{t('common.all')}</option>
                  {directions.map((d) => {
                    const config = getDirectionConfig(d.id)
                    return (
                      <option key={d.id} value={d.id}>
                        {lang === 'en' ? config?.en || d.title : config?.title || d.title}
                      </option>
                    )
                  })}
                </select>
                <Icon name="chevronDown" size={14} className={styles.selectIcon} />
              </span>
            </label>

            <label className={styles.selectWrap}>
              <span className={styles.filterLabel}>{t('pub.filter.sort')}</span>
              <span className={styles.selectBox}>
                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                >
                  <option value="desc">{t('pub.sort.desc')}</option>
                  <option value="asc">{t('pub.sort.asc')}</option>
                </select>
                <Icon name="chevronDown" size={14} className={styles.selectIcon} />
              </span>
            </label>
          </div>

          <span className={styles.resultCount}>
            {t('pub.total', { n: filtered.length })}
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
            title={lang === 'en' ? 'No matching publications' : '未找到匹配的论文'}
            desc={
              lang === 'en'
                ? 'Try adjusting the filters or the search keywords.'
                : '请尝试调整筛选条件或搜索关键词。'
            }
            actionLabel={lang === 'en' ? 'Reset filters' : '重置筛选'}
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
