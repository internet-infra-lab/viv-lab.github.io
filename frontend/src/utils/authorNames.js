import members from '../data/members.json'

/**
 * 论文署名 ↔ 站内成员关联（唯一映射源）
 *
 * 说明：
 * - papers.json 中作者多为英文署名（如 `Jiuqi Wei`），members.json 使用中文姓名，
 *   二者此前无关联，导致成员主页看不到本人论文、论文页作者名无法跳转；
 * - 中文期刊论文以中文姓名署名（如 `李颖`），因此映射同时收录中英文两种写法；
 * - 此处集中维护「英文署名 → 成员 id」，供论文详情页（作者跳转）、
 *   成员详情页与导师详情页（代表论文聚合）共用，避免多处各写一份；
 * - 同一成员存在署名变体时（如 `Xiaodong Lee` / `Xiaodong Li`），全部列入；
 * - 仅收录确属本实验室成员的署名；外部合作者（导师、企业/高校合作者）不收录，
 *   未收录的署名按普通文本展示、不生成链接。
 */
const SIGNATURE_TO_MEMBER = {
  'Xiaodong Lee': 'li-xiaodong',
  'Xiaodong Li': 'li-xiaodong',
  'Botao Peng': 'peng-botao',
  'Ying Li': 'li-ying',
  'Jiuqi Wei': 'wei-jiuqi',
  'Yue Su': 'su-yue',
  'Yufan Fu': 'fu-yufan',
  'Youyi Zhang': 'zhang-youyi',
  'Hao Zheng': 'zheng-hao',
  'Ziyu Fei': 'fei-ziyu',
  'Aiyao Zhang': 'zhang-aiyao',
  'Zhixian Zhuang': 'zhuang-zhixian',
  'Zhaojun Dai': 'dai-zhaojun',
  // 中文期刊论文的中文署名
  李颖: 'li-ying',
  李晓东: 'li-xiaodong',
  费子郁: 'fei-ziyu',
  彭博韬: 'peng-botao',
}

const MEMBER_BY_ID = Object.fromEntries(members.map((m) => [m.id, m]))

/** 依据论文署名反查站内成员（外部作者返回 undefined） */
export function memberBySignature(name) {
  const id = SIGNATURE_TO_MEMBER[name]
  return id ? MEMBER_BY_ID[id] : undefined
}

/** 取某成员在论文数据中可能使用的全部英文署名 */
export function signaturesOf(memberId) {
  return Object.entries(SIGNATURE_TO_MEMBER)
    .filter(([, id]) => id === memberId)
    .map(([name]) => name)
}

/** 成员主页路径：导师走 /faculty/:id，学生走 /team/:id */
export function memberPath(member) {
  return member.role === 'faculty' ? `/faculty/${member.id}` : `/team/${member.id}`
}

/** 汇总某成员参与署名的论文，按年份倒序 */
export function papersOfMember(papers, memberId) {
  const names = signaturesOf(memberId)
  if (names.length === 0) return []
  return papers
    .filter((p) => p.authors.some((a) => names.includes(a.name)))
    .sort((a, b) => b.year - a.year)
}
