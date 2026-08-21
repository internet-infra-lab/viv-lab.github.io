import site from '../data/site.json'

/**
 * 全站导航（信息架构调整后的统一来源）
 * - 「研究方向 + 科研项目」合并为「研究内容」(/research)；
 * - 原「科研项目」独立入口移除（/projects 重定向至 /research）；
 * - 「导师介绍」并入「团队成员」页（/faculty 列表页下线，导师详情由团队成员页链入）。
 *
 * 同时作为各内页 Page Header 章节编号（01/02/…）的基准，
 * 保证导航顺序与页面章节编号一致。
 */
export const NAV_ITEMS = site.nav
  .filter((item) => item.path !== '/projects')
  .map((item) => (item.path === '/research' ? { ...item, label: '研究内容' } : item))
