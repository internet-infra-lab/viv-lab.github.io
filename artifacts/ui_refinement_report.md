# 实验室官网 UI 视觉升级报告（UI Refinement Report）

| 项目 | 内容 |
| --- | --- |
| 编写角色 | Senior UI / Frontend Engineer |
| 编写日期 | 2025-08-21 |
| 任务性质 | 在现有 React 项目基础上的视觉升级（非重新开发） |
| 依据文档 | `docs/requirements.md`（PRD v1.0）、`docs/design.md`（Design Spec v1.0） |
| 约束遵守 | 未改数据结构、JSON 兼容、路由不变、`npm run build` 通过 |

---

## 1. 总体思路

在保留设计规范（学术蓝 `#1D4E89` 为主色、衬线标题 + 黑体正文、专业可信调性）的前提下，把页面从「功能完整的技术 Demo」提升为「高校科研实验室官方网站」：

- **去 SaaS 化**：大量减少「白卡片 + 描边 + 阴影」的模板式容器，改以留白、分隔线、编号、悬停强调线建立层次；
- **强 Hero**：首页首屏从「居中文字 + 渐变底」升级为「左对齐叙事 + 科研网络图谱装饰 + 数据驱动的荣誉徽章与方向快捷入口」；
- **品牌一致**：Logo 从「实」字方块升级为 ICP 渐变徽标，导航 / 页脚 / favicon 统一；修复既有 UI 缺陷（flask 图标缺失、375px 横向溢出）。

> 验证方式说明：本环境无法直接查看截图，故以 **Puppeteer（Chrome headless shell）DOM 实测** 完成视觉与布局验证（详见第 5 节）。

---

## 2. 修改文件清单

### 2.1 入口与全局

| 文件 | 修改内容 |
| --- | --- |
| `frontend/index.html` | 引入 Noto Serif SC / Noto Sans SC 学术字体（`media="print"` 非阻塞加载，离线自动回退系统字体） |
| `frontend/src/styles/global.css` | 令牌扩充（`--space-20/80`、`--color-primary-deep`、`--radius-xl`）、字号阶梯上调（Display 48px / H1 34px）、`::selection`、锚点 `scroll-margin-top`、`.prose` 富文本排版完整化（H2 色条、列表、引用、表格、代码） |
| `frontend/public/favicon.svg` | 「实」字 → ICP 渐变徽标 |

### 2.2 组件

| 文件 | 修改内容 |
| --- | --- |
| `frontend/src/components/Navbar.jsx` | Logo 标记 「实」→「ICP」 |
| `frontend/src/components/Navbar.module.css` | 吸顶毛玻璃 + 常驻细边框；导航 hover 药丸底色；Logo 渐变徽标；修复移动端超长英文名导致的 375px 横向溢出 |
| `frontend/src/components/Footer.jsx` | Logo 标记 「实」→「ICP」 |
| `frontend/src/components/Footer.module.css` | 深海军蓝渐变 + 顶部 3px 学术蓝饰线；徽标渐变 |
| `frontend/src/components/Icon.jsx` | **新增缺失的 `flask` 图标**（此前新闻封面 / 实验室概况图渲染为空） |
| `frontend/src/components/Card.module.css` | hover 时描边微染学术蓝，层次更明确 |
| `frontend/src/components/Section.module.css` | 去掉标题区底部整条边框，改为留白分隔；「查看全部」链接 hover 加深 |
| `frontend/src/components/PageHeader.module.css` | 标题区加浅网格纹理 + 底部发丝线，增大内边距 |
| `frontend/src/components/PublicationCard.module.css` | 论文条目从「盒状卡片」改为「列表行」（分隔线 + 悬停左侧强调线 + 年份衬线主色） |
| `frontend/src/components/NewsCard.jsx` | compact 模式调整为「日期 → 标题 → 箭头」议程式结构 |
| `frontend/src/components/NewsCard.module.css` | compact 三列网格 + 虚线分隔 + hover 箭头；封面加径向高光 |
| `frontend/src/components/RecruitBanner.module.css` | 琥珀色浅底加径向渐变层次 |

### 2.3 页面

| 文件 | 修改内容 |
| --- | --- |
| `frontend/src/pages/Home.jsx` | Hero 重构（徽章 / 方向快捷胶囊 / SVG 网络图谱装饰 / 滚动提示）；方向卡片改为编辑式整卡链接；新闻区去多余卡片嵌套 |
| `frontend/src/pages/Home.module.css` | 整体重写：Hero 左对齐叙事布局、深蓝三色渐变 + 网格纹理 + 光晕 + 漂浮粒子、数据条细线分隔、方向卡片编号水印与悬停顶线 |
| `frontend/src/pages/Publications.module.css` | 列表容器去掉 item 间 gap，适配分隔线列表 |
| `frontend/src/pages/News.module.css` | 首条大版式去边框，改阴影悬浮卡片 |
| `frontend/src/pages/Research.module.css` | 方向图标圆角细化，hover 填充主色 |
| `frontend/src/pages/About.module.css` | 概况示意图加径向高光 |
| `frontend/src/pages/detail.module.css` | 相关论文列表适配分隔线行距 |

---

## 3. 设计变化（前后区别）

### 3.1 首页 Hero

| 维度 | 升级前 | 升级后 |
| --- | --- | --- |
| 布局 | 内容居中（max-width 760px 居中） | 左对齐叙事，信息层级自上而下：校名眉题 → 荣誉徽章 → 定位主标题 → 副文案 → CTA → 方向快捷入口 |
| 视觉焦点 | 单一渐变底 + 斜纹 | 深蓝三色渐变 + 科研网格纹理 + 右上网络图谱装饰（纯 SVG 节点连线，无外部图片）+ 漂浮粒子 + 顶部微光 |
| CTA 主次 | 主按钮为白底（反色） | 主按钮恢复规范主色蓝底（design.md C-02），次按钮白描边；hover 上浮 + 投影 |
| 科研氛围 | 弱 | 徽章（数据驱动自 `site.honors[0]`）+ 三个方向胶囊快捷入口（数据驱动自 `directions`），30 秒内同时完成「身份 + 主题 + 分流」 |
| 高度/节奏 | 96/64px 内边距 | 120/96px（`clamp` 响应式），首屏更饱满 |
| 细节 | — | 底部滚动提示（尊重 `prefers-reduced-motion`）；<1200px 自动隐藏图谱装饰 |

### 3.2 数据概览条

- 从「4 个带右侧描边的盒子」改为「无外框 + 数字间 1px 细分隔线」；数字放大至 `clamp(32, 3.2vw, 40px)` 衬线等宽；移动端 2×2 网格自动加行分隔。

### 3.3 研究方向卡片

| 维度 | 升级前 | 升级后 |
| --- | --- | --- |
| 容器 | 通用 Card（1px 描边 + 阴影 + 上浮） | 编辑式卡片：无描边、柔和阴影、右上角衬线序号水印（01/02/03/04） |
| 悬停 | 整体上浮 | 上浮 + 顶部 3px 学术蓝强调线 + 图标由浅底填充为实心主色 + 「了解详情 →」滑入 |
| 信息密度 | 图标 / 标题 / 摘要 | 同结构，但序号与 hover 动效赋予「研究纲领」感，消除重复卡片模板感 |

### 3.4 论文条目（最新成果 / 论文列表）

| 维度 | 升级前 | 升级后 |
| --- | --- | --- |
| 形态 | 每篇一个圆角描边盒子 | 列表行：行间 1px 分隔线、首尾无框，整页更像「成果目录」而非卡片堆 |
| 层级 | 年份为灰色小字 | 年份改为衬线主色加粗，作为行的视觉锚点；类型标签保留 |
| 悬停 | 底色变浅 | 左侧滑出 3px 学术蓝强调线 + 标题变主色（悬停态更克制、更学术） |

### 3.5 新闻区

- 首页侧栏 compact 改为「日期（等宽）→ 标题 → hover 箭头」三列议程式列表，虚线与实线交替降低边界感；
- 新闻封面 / 首条大版式 / 实验室概况图统一加径向高光，视觉更有纵深感；
- **修复缺陷**：`Icon.jsx` 缺失 `flask` 图标，新闻封面此前只显示空渐变块。

### 3.6 导航与品牌

- Logo：40px 学术蓝渐变圆角徽标「ICP」（导航 / 页脚 / favicon 三处统一），替代「实」字方块；
- 导航项 hover 增加浅蓝药丸底色，当前项保持 3px 下划线；吸顶时毛玻璃 + 阴影；
- **修复缺陷**：375px 视口下导航因超长英文名横向溢出 68px（隐藏移动端英文副名 + 压缩间距后消除）。

### 3.7 内页与全局

- PageHeader：浅网格纹理 + 底部发丝线，栏目页与 Hero 呼应；
- Section 标题区去边框、留白加大，板块节奏从 64px 提升至 96px（移动端 48px）；
- Footer：顶部 3px 学术蓝饰线 + 深蓝渐变，收尾更有品牌感；
- `.prose` 富文本排版补全（H2 主色条、引用块、表格、代码），详情页长文更接近论文排版；
- 全部动效 ≤200ms 且尊重 `prefers-reduced-motion`；焦点环沿用 2px 主色规范。

---

## 4. 未修改项（约束确认）

- **数据结构 / JSON**：`site.json`、`directions.json`、`papers.json`、`news.json`、`members.json` 零改动；Hero 徽章与方向胶囊全部由既有数据字段驱动；
- **路由**：`App.jsx` 路由表未动，12 条路由 + 404 行为不变；
- **技术栈**：React 18 + Vite 5 + CSS Modules，无新依赖；Google Fonts 以渐进增强方式引入（非阻塞，离线可用系统字体回退）。

---

## 5. 验证结果

### 5.1 构建验证（交付硬性要求）

```
> vite build
✓ 93 modules transformed.
dist/index.html                   1.22 kB │ gzip:  0.76 kB
dist/assets/index-*.css           57.27 kB │ gzip: 10.21 kB
dist/assets/index-*.js           258.50 kB │ gzip: 89.54 kB
✓ built in 1.96s
```

`npm run build` **成功**（开发期多次构建通过）。

### 5.2 路由冒烟（Puppeteer headless 实测，生产 preview 与 dev 双环境）

- 覆盖 14 条路由：`/`、`/about`、`/team`、`/team/1`、`/research`、`/research/dir1`、`/publications`、`/publications/pdet-lsh-tkde-2026`、`/news`、`/news/nsfc-key-project-2025`、`/faculty`、`/projects`、`/join-us`、404 通配。
- 结果：**全部无 console / pageerror 异常**（已排除字体请求中断噪声）。

### 5.3 首页布局指标（1440px）

| 指标 | 实测值 |
| --- | --- |
| Hero 高度 | 547px（≈规范 560px 档） |
| Hero 主标题 | 48px 衬线（Noto Serif SC 优先） |
| Hero 内边距 | 120px / 96px |
| 数据条项数 | 4（细线分隔生效） |
| 方向卡片 | 4 列（270px × 4），编号 / 胶囊 / 徽章渲染正常 |
| 论文条目 / 新闻条目 | 3 / 4，分栏 8:4（746px / 373px） |

### 5.4 响应式验证（PRD A-02 四档）

- **横向溢出**：375 / 768 / 1280 / 1920 四档 × 7 个页面（`/`、`/about`、`/research`、`/publications`、`/news`、`/team`、`/join-us`）**全部 0 溢出**；
- **390px 移动端**：CTA 纵向堆叠、数据条 2×2、方向卡 1 列、分栏 1 列、滚动提示隐藏 ✓；
- **768px 平板**：方向卡 2 列、数据条 4 列 ✓；
- **1280px 桌面**：方向卡 4 列、成果/新闻 8:4、网络图谱装饰可见 ✓；
- **移动端抽屉**：点击汉堡展开 9 个导航项、无溢出 ✓。

### 5.5 生产构建产物验证（`vite preview`）

- 首页：Hero / 4 统计 / 4 方向卡 / 3 论文 / 4 新闻 / 页脚 全部渲染 ✓；
- 论文页：10 条列表行 / 筛选栏 / 分页 ✓；
- 新闻页：首条大版式 / 9 张网格卡 / flask 封面图标 ✓。

---

## 6. 遗留说明

- 字体 CDN（fonts.googleapis.com）为可选增强，被屏蔽时页面仍以系统衬线/黑体栈正常渲染（已实测）；
- 后续若接入真实 Hero 主视觉图片，替换 `Home.module.css` 中 `.hero` 的背景渐变即可，无需改组件结构；
- 本次未触碰 `ComingSoon`（导师介绍 / 科研项目 / 招生招聘占位页）的业务逻辑，仅随 PageHeader 统一获得视觉升级。

---

*本报告随 UI 视觉升级交付；后续视觉调整建议同步更新 `docs/design.md` 基线。*
