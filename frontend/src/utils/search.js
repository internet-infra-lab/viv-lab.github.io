import papers from '../data/papers.json'
import news from '../data/news.json'
import members from '../data/members.json'
import directions from '../data/directions.json'
import { getDirectionConfig } from '../config/researchDirections'
import { memberBySignature } from './authorNames'

/**
 * 全站搜索索引与检索引擎
 *
 * 覆盖范围：学术成果（论文）、新闻动态、团队成员、研究方向。
 * 设计要点：
 * - 数据量很小（当前 20 篇论文 / 10 条新闻 / 20 位成员 / 4 个方向），
 *   在模块加载时一次性构建扁平索引，检索时纯内存过滤，无需额外依赖；
 * - 中文按子串匹配（中文不依赖分词即可满足站内检索需要），
 *   英文与数字做小写归一化；多个关键词以空格分隔时取「全部命中」（AND）；
 * - 打分区分标题 / 标签 / 正文三级，标题命中权重最高，保证结果排序可解释。
 */

/** 搜索分类定义（数组顺序即结果分组展示顺序） */
export const SEARCH_GROUPS = [
  { type: 'paper', label: '学术成果', icon: 'fileText', unit: '篇' },
  { type: 'news', label: '新闻动态', icon: 'newspaper', unit: '条' },
  { type: 'member', label: '团队成员', icon: 'users', unit: '人' },
  { type: 'direction', label: '研究方向', icon: 'ml', unit: '个' },
]

/** 角色中文名（团队成员结果展示用） */
const ROLE_LABEL = {
  faculty: '导师',
  phd: '博士生',
  master: '硕士生',
}

/** 把新闻的块式正文压平成一整段可检索文本 */
function newsBody(item) {
  const blocks = Array.isArray(item.content) ? item.content : []
  return blocks
    .map((block) => [block.text, ...(block.items || [])].filter(Boolean).join(' '))
    .join(' ')
}

/** 研究方向的中文标签（论文按 research_direction 关联展示用） */
function directionLabels(ids = []) {
  return ids.map((id) => getDirectionConfig(id)?.title).filter(Boolean)
}

/** 构建扁平索引：每条记录都带有可检索的三层文本（title / tags / body） */
function buildIndex() {
  const entries = []

  // ---- 学术成果 ----
  for (const p of papers) {
    const authors = p.authors
      .map((a) => (a.corresponding ? `${a.name}*` : a.name))
      .join(', ')
    entries.push({
      type: 'paper',
      id: p.id,
      href: `/publications/${p.id}`,
      title: p.title,
      subtitle: authors,
      meta: `${p.venue} · ${p.year}`,
      badge: p.type,
      tags: [
        ...(p.keywords || []),
        ...p.authors.map((a) => a.name),
        // 站内成员的论文补上中文姓名，便于用中文名检索英文署名论文
        ...p.authors.map((a) => memberBySignature(a.name)?.name).filter(Boolean),
        ...directionLabels(p.research_direction),
        p.venue,
        p.type,
        String(p.year),
      ].join(' '),
      body: p.abstract || '',
    })
  }

  // ---- 新闻动态 ----
  for (const n of news) {
    entries.push({
      type: 'news',
      id: n.id,
      href: `/news/${n.id}`,
      title: n.title,
      subtitle: n.summary || '',
      meta: `${n.date} · ${n.category}`,
      badge: n.category,
      tags: [n.category, n.date].join(' '),
      body: newsBody(n),
    })
  }

  // ---- 团队成员 ----
  for (const m of members) {
    const external = m.role === 'faculty' && m.externalDetail && m.homepage
    const roleLabel = ROLE_LABEL[m.role] || m.title || '成员'
    const statusLabel = m.status === 'graduated'
      ? `已毕业${m.graduationYear ? `（${m.graduationYear}）` : ''}`
      : ''
    entries.push({
      type: 'member',
      id: m.id,
      href: external ? m.homepage : m.role === 'faculty' ? `/faculty/${m.id}` : `/team/${m.id}`,
      external: !!external,
      title: m.name,
      subtitle: m.researchArea || m.bio || `${roleLabel}${m.grade ? ` · ${m.grade}` : ''}`,
      meta: [roleLabel, m.grade, statusLabel].filter(Boolean).join(' · '),
      badge: roleLabel,
      tags: [
        m.title,
        m.grade,
        m.researchArea,
        ...directionLabels(m.research_direction),
      ]
        .filter(Boolean)
        .join(' '),
      body: m.bio || '',
    })
  }

  // ---- 研究方向 ----
  for (const d of directions) {
    const config = getDirectionConfig(d.id)
    entries.push({
      type: 'direction',
      id: d.id,
      href: `/research/${d.id}`,
      title: config?.title || d.title,
      subtitle: config?.summary || d.summary || d.lead || '',
      meta: '研究方向',
      badge: '方向',
      tags: [...(d.keywords || []), ...(d.methods || []), ...(config?.keywords || [])].join(' '),
      body: [...(d.content || []), d.lead || ''].join(' '),
    })
  }

  return entries
}

const INDEX = buildIndex()

/** 把查询串拆成检索词（空格分隔，大小写归一） */
export function tokensOf(query) {
  return String(query || '')
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * 执行检索
 * @returns {{ tokens: string[], total: number, groups: Array }}
 *          groups 仅包含有结果的分类，顺序与 SEARCH_GROUPS 一致
 */
export function searchAll(query) {
  const tokens = tokensOf(query)
  if (tokens.length === 0) return { tokens, total: 0, groups: [] }

  const hits = []
  for (const entry of INDEX) {
    const title = entry.title.toLowerCase()
    const tags = entry.tags.toLowerCase()
    const body = entry.body.toLowerCase()

    let score = 0
    let allMatched = true
    for (const token of tokens) {
      if (title.includes(token)) {
        score += title.startsWith(token) ? 120 : 100
      } else if (tags.includes(token)) {
        score += 60
      } else if (body.includes(token)) {
        score += 25
      } else {
        allMatched = false
        break
      }
    }
    if (!allMatched) continue
    hits.push({ ...entry, score })
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh'))

  const groups = SEARCH_GROUPS.map((group) => ({
    ...group,
    items: hits.filter((hit) => hit.type === group.type),
  })).filter((group) => group.items.length > 0)

  return { tokens, total: hits.length, groups }
}

/** 热门关键词（由论文关键词频次推导，用于空查询时的推荐） */
export const HOT_KEYWORDS = (() => {
  const counter = new Map()
  for (const p of papers) {
    for (const k of p.keywords || []) {
      counter.set(k, (counter.get(k) || 0) + 1)
    }
  }
  return [...counter.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh'))
    .slice(0, 8)
    .map(([k]) => k)
})()
