/**
 * 研究方向展示配置（前端表现层）
 *
 * 说明：
 * - 依据论文数据与实验室真实定位「面向智能互联网的数据互操作基础设施」，
 *   将研究方向归纳为以下 4 个核心方向；
 * - 每个方向通过 `id` 与 data/directions.json 中的方向条目关联，
 *   保证「相关论文 / 相关成员 / 方向详情正文」等数据仍按原 id 聚合；
 * - 此处仅承载标题、简介、图标、关键词等展示文案，
 *   不修改任何数据工程产出文件（data/*.json）。
 */

export const RESEARCH_DIRECTIONS = [
  {
    id: 'dir8',
    title: '数据互操作与智能互联网基础设施',
    en: 'Data Interoperation & Intelligent Internet Infrastructure',
    icon: 'ml',
    summary:
      '面向智能互联网的数据互操作需求，研究数据授权、互操作与可信流转的关键技术，推动数据在跨主体、跨系统间安全共享、高效流通。',
    keywords: ['数据互操作', '数据授权', '去中心化数据管理', '访问控制'],
  },
  {
    id: 'dir7',
    title: '数据安全、身份认证与跨域授权',
    en: 'Data Security, Identity Authentication & Cross-Domain Authorization',
    icon: 'search',
    summary:
      '研究数据安全防护、身份认证与跨域授权、域名滥用检测与隐私保护技术，构建智能互联网数据流转的安全可信基础。',
    keywords: ['身份认证', '跨域授权', '数据安全', '隐私保护'],
  },
  {
    id: 'dir6',
    title: '互联网基础资源安全与治理',
    en: 'Internet Fundamental Resource Security & Governance',
    icon: 'hpc',
    summary:
      '面向域名系统（DNS）、标识解析等互联网基础资源的建设、运行与安全保障，研究解析性能评估与治理机制，支撑国家网络空间基础设施的安全稳定。',
    keywords: ['域名系统', 'DNS', '标识解析', '网络治理'],
  },
  {
    id: 'dir9',
    title: '大规模数据管理与智能计算',
    en: 'Large-Scale Data Management & Intelligent Computing',
    icon: 'llm',
    summary:
      '研究面向时间序列与高维数据的索引、检索与分析系统，结合多核 CPU、GPU 等现代硬件优化，构建高性能的大规模数据管理基础设施。',
    keywords: ['时间序列索引', '近似最近邻搜索', 'GPU 加速', '高维数据'],
  },
]

/** 取单个方向的展示配置（未配置的方向返回 undefined，调用方可回退到数据源） */
export function getDirectionConfig(id) {
  return RESEARCH_DIRECTIONS.find((d) => d.id === id)
}
