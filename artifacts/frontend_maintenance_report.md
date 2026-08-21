# 前端维护报告（Frontend Maintenance Report）

| 项目 | 内容 |
| --- | --- |
| 编写角色 | Frontend Maintenance Engineer |
| 编写日期 | 2026-08-21 |
| 本轮范围 | 小范围前端修正：Hero 标签删除 / 实验室介绍占位图删除 / 在读研究生动态统计 / 全站硬编码统计复查 / 页脚留白 |
| 约束执行 | ✅ 未做整体视觉重构 · 未修改任何数据文件（`frontend/src/data/*.json`）· 未新增/删除数据内容 |

---

## 1. 修改文件

| 文件 | 改动 |
| --- | --- |
| `frontend/src/utils/stats.js` | **新增**：全站统一动态统计 helper（`LAB_STATS`） |
| `frontend/src/pages/Home.jsx` | 删除 Hero 胶囊标签；统计条改用 `LAB_STATS`；移除 `members` 直连引用 |
| `frontend/src/pages/Home.module.css` | 删除 `.heroBadge` 样式；`heroOverline` 下边距 18→24px，删除标签后顶部文字节奏自然 |
| `frontend/src/pages/About.jsx` | 删除「实验室环境（示意图）」占位图；概况改为单栏宽正文；正文统计短语动态替换；研究方向数量动态化 |
| `frontend/src/pages/About.module.css` | `.overview` 由「图+文双栏 grid」改为单栏宽正文（max-width 860px）；删除 `.overviewImage` / `.imageCaption` 及对应响应式规则 |
| `frontend/src/components/Footer.module.css` | 页脚内容区顶部内边距 `--space-48` → `--space-64`（深蓝导航栏文字留白） |

## 2. 删除内容

- **首页 Hero**：胶囊标签「互联网基础技术实验室」（`heroBadge`）及其 CSS；保留「中国科学院计算技术研究所」、主标题、副标题、CTA、研究方向快捷标签。
- **实验室介绍概况区**：整个「实验室环境（示意图）」占位图区块（`overviewImage` / `imageCaption`），未新增任何占位图。

## 3. 动态统计实现方式

新增 `frontend/src/utils/stats.js`，统一从数据文件推导，页面禁止写死数字：

```js
// 口径（与 members.json 现状一致）
const isFaculty = (m) => m.role === 'faculty'
const isStudent = (m) => m.role === 'phd' || m.role === 'master'
const isCurrentStudent = (m) => isStudent(m) && m.status !== 'graduated'  // 已毕业不计入在读

export const LAB_STATS = {
  facultyCount,          // 教师
  currentStudentCount,   // 在读研究生（status !== 'graduated'）
  paperCount,            // papers.json 条目数
  directionCount,        // RESEARCH_DIRECTIONS 数量
}
```

使用位置：
- **首页统计条**：四项全部来自 `LAB_STATS`；
- **实验室介绍正文**：对数据正文中出现的 `在读研究生 \d+ 人`、`研究人员 \d+ 人` 短语做正则替换为动态值（数据文件本身未改动，若数据文本变化则替换自动失效、原样保留）；
- **实验室介绍交叉入口**：「4 个核心研究方向」改为 `{LAB_STATS.directionCount} 个核心研究方向`；
- **团队成员页**：在读/已毕业分组计数原本即由 `members.json` 实时计算（`current.length` / `alumni.length`），无需改动，已复核。

## 4. 发现并修正的硬编码/不准确统计位置

| 位置 | 原状态 | 修正 |
| --- | --- | --- |
| **首页统计条「在读学生」** | `members.filter(role==='phd'｜'master').length` —— **把 7 名已毕业成员也计入（16 人）** | 改为 `status !== 'graduated'` 过滤 → **9 人**（已毕业不计入在读） |
| **首页统计条「教师/论文/方向」** | 内联推导（数值正确，但逻辑分散在页面） | 统一收敛到 `LAB_STATS`，全站口径一致 |
| **实验室介绍正文** | 数据正文写死「在读研究生 16 人」（应为 9） | 渲染时正则替换为 `LAB_STATS.currentStudentCount` → 「在读研究生 9 人」；「研究人员 2 人」同步动态化 |
| **实验室介绍交叉入口** | 写死「四个核心研究方向」 | 改为 `LAB_STATS.directionCount` 动态输出 |
| **团队成员页** | 计数已动态（未硬编码） | 复核通过，未改动 |
| **学术论文列表页** | 「共 N 篇」已由 `filtered.length` 动态计算 | 复核通过，未改动 |
| **招生招聘页（JoinUs）** | 无人数统计 | 复核通过，未改动 |

全站 JSX 中已无 `\d+(人|篇|项|个)` 形式的硬编码统计（仅注释与 UI 上限常量如"代表论文 5~10 篇"）。

## 5. 构建与验证结果

- `npm run build` ✅ 通过（96 modules；CSS 73.50 kB / gzip 12.60 kB；JS 265.83 kB / gzip 88.67 kB）
- SSR 渲染验证：
  - 首页：胶囊标签已删除（无 `heroBadge`），保留单位/主标题；统计条实渲染 **教师 2 人 / 在读学生 9 人 / 论文 30 篇 / 方向 4 个**；
  - 实验室介绍：占位图区块已删除；正文统计句渲染为 **「研究人员 2 人、在读研究生 9 人」**；方向数动态（4 个核心研究方向）；
  - 团队成员页：**在读 9 人 / 已毕业 7 人**；
- 路由冒烟：`/`、`/about`、`/team`、`/join-us`、`/faculty` 均 HTTP 200。

---

*本报告与 `frontend/` 当前代码一致；后续代码变更请同步更新本报告。*
