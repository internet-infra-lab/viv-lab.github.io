/**
 * 科研项目展示配置（未来数据加载点）
 *
 * 说明：
 * - 当前暂无整理好的真实项目数据，PROJECTS 保持为空数组，**不虚构项目**；
 * - 页面渲染逻辑已就绪：PROJECTS 非空时自动以卡片网格展示（见 pages/Research.jsx 第二部分）；
 * - 未来真实数据就绪后，可改为从数据文件加载（如 `src/data/projects.json`），
 *   建议字段结构（与 PRD 7.2 一致）：
 *   { id, title, type（国家级/省部级/横向/国际合作）, number, period, pi, summary, status }
 */
export const PROJECTS = []
