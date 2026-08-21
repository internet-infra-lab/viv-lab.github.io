# 官网视觉精修报告（Visual Refinement Report）

| 项目 | 内容 |
| --- | --- |
| 编写角色 | Senior Frontend / Visual Refinement Engineer |
| 编写日期 | 2026-08-21 |
| 本轮目标 | 提升官网视觉质量与页面节奏，不新增业务功能 |
| 范围 | 首页 / 导师介绍 / 团队成员 / 研究方向 + 全站布局修复 |
| 约束执行 | ✅ 未修改数据文件（`frontend/src/data/*.json`）· 未改路由 · 未重写项目 · `npm run build` 通过 |

---

## 1. 修改页面与设计变化

### 1.1 首页（`/`）

**Hero 区 —— 更强的科研视觉表达**
- 将原「抽象散点线条图」升级为**「数据互操作科研拓扑」**：中心枢纽（数据互操作）+ 6 个带标签卫星节点（DNS·标识解析 / 授权·认证 / 数据安全 / 治理·合规 / 智能计算 / 互操作协议）+ 卫星间次链路；
- 新增**数据流主链路流动动画**（stroke-dashoffset 流动）与**中心枢纽扩散环 + 呼吸脉冲**动画，全部尊重 `prefers-reduced-motion`；
- 全部为纯 SVG/CSS 实现，无外部图片依赖，<1200px 自动隐藏（保留网格/光晕底纹）。

**研究方向区 —— 打破四张同构卡片**
- 改为 **「首卡 featured + 三行紧凑条目」** 非对称布局：
  - 首方向（数据互操作与智能互联网基础设施）：大卡 featured，primary 渐变浅底 + 顶边强调 + 实心图标块 + 关键词标签；
  - 其余三个方向：横排紧凑行（序号 / 图标块 / 标题+单行简介 / 悬停箭头），视觉层级明确区分；
- 板块标题新增编辑式序号（01/02/03，Section 组件新增可选 `index` 属性）。

**最新成果 / 新闻动态 —— 增强层次、减少列表感**
- 最新成果：首篇论文升级为 **featured 论文卡**（"代表成果"徽标 + 年份 + 期刊 + 标题 + 作者 + DOI 外链），其余两篇保留论文条目行；
- 新闻动态：右侧改为 **浅灰面板 + 头条新闻**（日期·分类 / 标题 / 摘要 / 阅读全文），下方为紧凑条目列表；
- 新闻数据为空时显示虚线空态提示（见 §3 数据问题）。

### 1.2 导师介绍（`/faculty`）

- 列表由「全宽横排大卡 + 大间距」改为 **2 列紧凑纵向身份卡**（减少大面积空白）；
- 卡片信息层级强化：**姓名（大号衬线，可点击）→ 职称胶囊徽标 → 单位 → 研究领域 → 方向标签 → 邮箱/个人主页 → 全宽"查看完整履历"按钮**；
- 头像区预留**优雅展示区域**：4:3 比例，渐变浅底 + 虚线内圈 + 大字姓名首字占位（`photo` 字段就绪后自动替换为真实头像，`object-position` 适配人像构图）。

### 1.3 团队成员（`/team`）

- 保持单页纵向结构（教师团队 → 在读研究生 → 已毕业研究生），不使用博士/硕士 Tab；
- 学生卡片由"纯文字矩形"升级为**身份卡**：圆形头像占位（姓名首字）→ 姓名 → 「学历类型 · 入学年级/毕业年份」→ 研究方向（文字或可点击标签）；
- **在读成员视觉优先**：白底实线卡 + 悬停顶部强调线；
- **已毕业成员弱化**：浅灰底、虚线边框、降透明度、灰化头像；
- 教师团队卡片：头像块 + 姓名/职称/研究方向 + "查看详情"按钮，点击进入导师详情页。

### 1.4 研究方向（`/research`）

- 保留四个方向，卡片差异化：**01–04 衬线编号水印** + **偶数位交替底色**（`nth-child(2n)` 浅灰）+ 悬停顶边强调线；
- 强化信息层级：图标块 / 标题 / 英文名 / 摘要 / 关键词标签 / "了解更多"。

### 1.5 品牌一致性（顺带修复）

- 页脚：品牌标识由硬编码 `ICP` 改为 `site.lab.shortName`（IFTL）；定位文案由「多模态智能感知与自主决策」更正为「面向智能互联网的数据互操作基础设施」；
- `index.html`：`<title>` 与 meta description 由「智能感知与计算实验室 | ICP Lab」更正为「互联网基础技术实验室 | IFTL」。

---

## 2. 修改文件清单

| 文件 | 类型 | 改动 |
| --- | --- | --- |
| `frontend/src/styles/global.css` | 样式 | 全站布局修复（见 §3） |
| `frontend/index.html` | HTML | 标题 / Meta 品牌更正 |
| `frontend/src/components/Section.jsx` | 组件 | 新增可选 `index` 序号属性 |
| `frontend/src/components/Section.module.css` | 样式 | 序号样式 |
| `frontend/src/pages/Home.jsx` | 页面 | Hero 拓扑、方向 featured+紧凑行、featured 论文、新闻面板+空态 |
| `frontend/src/pages/Home.module.css` | 样式 | 拓扑动画、方向布局、featured 论文、新闻面板、空态、响应式 |
| `frontend/src/pages/Faculty.jsx` | 页面 | 网格容器（2 列） |
| `frontend/src/components/FacultyCard.jsx` | 组件 | 纵向身份卡结构 |
| `frontend/src/components/FacultyCard.module.css` | 样式 | 纵向卡、头像占位区 |
| `frontend/src/pages/Faculty.module.css` | 样式 | 2 列网格 + 响应式 |
| `frontend/src/pages/Team.jsx` | 页面 | 学生卡头像、教师卡头像结构 |
| `frontend/src/pages/Team.module.css` | 样式 | 头像占位、身份卡、已毕业弱化 |
| `frontend/src/pages/Research.jsx` | 页面 | 方向编号水印 |
| `frontend/src/pages/Research.module.css` | 样式 | 编号水印、交替底色、悬停顶线 |
| `frontend/src/components/Footer.jsx` | 组件 | 品牌标识 / 定位文案更正 |

未修改：任何 `frontend/src/data/*.json`、路由表（`App.jsx`）、其余页面组件。

---

## 3. Footer 贴底修复方式（全站布局）

**问题**：内容不足一屏的页面（如 /projects、/join-us、/research 等），页脚悬浮在内容下方，不贴底。

**修复**（`global.css`，一处全局生效）：

```css
html,
body { min-height: 100%; }

#root {
  min-height: 100vh;
  min-height: 100dvh;   /* 移动端地址栏适配 */
  display: flex;
  flex-direction: column;
}

main { flex: 1 0 auto; width: 100%; }
```

- `#root` 作为弹性列容器撑满视口，`main` 通过 `flex: 1 0 auto` 吸收剩余高度，将页脚压至底部；
- 所有页面自动受益，无需逐页处理；`Navbar` 为 sticky 定位不受影响，`BackToTop` 为 fixed 定位不在文档流中。

---

## 4. 构建与验证结果

- `npm run build` ✅ 通过（96 modules；CSS 75.43 kB / gzip 12.83 kB；JS 266.58 kB / gzip 88.73 kB）
- SSR 渲染验证（Vite 服务端渲染逐页检查）：
  - 首页：拓扑动画类（flowPath/hubRing）、featured 方向卡、紧凑行、featured 论文卡、板块序号、新闻空态 ✅
  - 导师介绍：头像区（photoWrap）、履历入口 ✅
  - 团队成员：学生/教师头像占位、已毕业弱化样式 ✅
  - 研究方向：编号水印、交替底色（产物中为 `nth-child(2n)`，esbuild 已优化）✅
- 布局规则在产物中确认：`#root{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column}`、`main{flex:1 0 auto;width:100%}` ✅
- 全路由冒烟测试：`/`、`/about`、`/faculty`、`/faculty/:id`、`/team`、`/research`、`/research/:id`、`/publications`、`/news`、`/projects`、`/join-us` 均 HTTP 200 ✅

---

## 5. 数据问题提醒（非本轮改动导致）

- **`frontend/src/data/news.json` 当前为空数组 `[]`**（会话开始时为 12 条 / 8.6KB，现为 3 字节）。首页新闻区已增加空态兜底（"新闻动态整理中，敬请期待"），新闻列表页本身有空态处理，均不会报错；但新闻数据需要数据侧恢复，恢复后首页头条/列表自动展示，无需改前端。
- 首页统计"学术论文 30 篇"来自 `papers.json` 全量（含 14 篇示例占位），替换占位论文后数字自动更新。

---

## 6. 修复记录：首页研究方向区布局回归（2026-08-21）

**现象**：方向区第一张卡被挤成竖向窄卡、02/03/04 被拉成长条、区域高度异常向下挤压后续内容。

**根因**（CSS Grid 隐式最小尺寸 + fr 分配失衡）：
- 上一版方向区使用不对称双列 `grid-template-columns: 1.02fr 1.48fr`（首卡 featured + 右侧紧凑行）；
- 右侧紧凑行摘要 `.dirRowSummary { white-space: nowrap; overflow: hidden }` 将**第二列的最小内容宽度（min-content）撑到整行简介文本的完整宽度**；
- 首卡 `.dirFeatured { overflow: hidden }` 使其网格项**自动最小尺寸（min-width:auto）被重置为 0**；
- 结果 `fr` 只在「容器宽 − 第二列最小宽」的剩余空间上分配，第一列被压缩到极窄，首卡文字大量换行 → 竖向窄卡 + 超高，右列被拉成长条，整体失衡。

**修复**（仅方向区，未做视觉重构）：
- 结构恢复为**均匀 4 卡网格**（桌面 4 列 / 平板 2 列 / 移动 1 列），移除 featured/紧凑行不对称布局；
- 摘要使用正常换行（`white-space` 默认）+ `-webkit-line-clamp: 3` 截断，**禁用 nowrap**；卡片不再设置 `overflow: hidden`；
- 数据、标题、描述、路由、蓝色学术风格均保持不变。

**修改文件**：`frontend/src/pages/Home.jsx`（方向区结构）、`frontend/src/pages/Home.module.css`（方向区样式与响应式规则）。

**验证**：`npm run build` ✅；产物确认 `directionGrid{grid-template-columns:repeat(4,1fr)}` + `<1200` 两列 + `<768` 单列；SSR 渲染确认 4 张方向卡（四个新标题全部就位）；无 `1.02fr`/`dirFeatured`/`dirRow` 残留；`/` 路由 200。

---

*本报告与 `frontend/` 当前代码一致；后续代码变更请同步更新本报告。*
