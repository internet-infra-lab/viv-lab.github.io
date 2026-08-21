# 实验室官网前端 —— 交付报告

| 项目 | 内容 |
| --- | --- |
| 编写角色 | Frontend Engineer |
| 编写日期 | 2025-08-21 |
| 依据文档 | `docs/requirements.md`（PRD v1.0）、`docs/design.md`（Design Spec v1.0） |
| 冲突处理 | 需求冲突时以 `docs/requirements.md` 为准 |
| 代码位置 | `frontend/`（未修改 `docs/` 下任何文档） |

---

## 1. 技术方案

| 项 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | React 18.3 + Vite 5 | 函数组件 + Hooks，现代组件化 |
| 路由 | react-router-dom v6 | BrowserRouter，SPA 路由 |
| 样式 | CSS Modules + 全局设计令牌 | 样式与组件一一对应，令牌定义在 `src/styles/global.css`（对应 design.md 第 2 节，含全部色值/字号/间距/圆角/阴影） |
| 数据 | 本地静态 JSON（ES import） | 无后端；对应 PRD 7.5「数据与页面结构解耦」约定，为后续接入 CMS 预留 |
| 语言 | 原生 JavaScript（JSX） | 无 TypeScript，降低上手门槛 |
| 字体 | 系统字体栈（衬线标题 + 黑体正文） | 不引入外部字体请求，离线可用 |
| 图标 | 自绘线性 SVG 图标组件（`Icon.jsx`） | 对应 design.md 2.5 图标规范，无第三方图标库 |
| 图片 | 无外部图片依赖 | 头像/封面均以 CSS 渐变 + 姓名首字/图标占位（对应 PRD 风险 R1 应对方案） |

### 依赖清单

- 运行时：`react`、`react-dom`、`react-router-dom`
- 开发时：`vite`、`@vitejs/plugin-react`

---

## 2. 目录结构与创建的文件

```
frontend/
├── package.json / vite.config.js / index.html / .gitignore
├── public/
│   └── favicon.svg                        # 站点图标（主色「实」字标）
└── src/
    ├── main.jsx                           # 入口：挂载 + BrowserRouter
    ├── App.jsx                            # 路由表（12 条路由 + 通配 404）
    ├── styles/
    │   └── global.css                     # 设计令牌 + Reset + 基础排版
    ├── data/                              # 本地静态数据（PRD 7.2 字段规范）
    │   ├── site.json                      # 站点配置：实验室信息/导航/统计/里程碑/荣誉/联系
    │   ├── members.json                   # 成员数据（17 人，5 种角色）
    │   ├── papers.json                    # 论文数据（14 篇，期刊/会议/专利）
    │   ├── news.json                      # 新闻数据（12 条，4 个分类）
    │   └── directions.json                # 研究方向（5 个）
    ├── components/                        # 可复用组件（13 个组件 + 12 个样式）
    │   ├── Navbar.jsx/.module.css         # 顶部导航：吸顶压缩/当前高亮/搜索/移动端抽屉
    │   ├── Footer.jsx/.module.css         # 四栏深色页脚：品牌/快捷/友情/联系
    │   ├── Card.jsx/.module.css           # 通用卡片容器（悬停上浮）
    │   ├── Section.jsx/.module.css        # 板块容器（标题 + 英文副题 + 查看全部）
    │   ├── MemberCard.jsx/.module.css     # 成员卡片（3:4 头像位/姓名/身份）
    │   ├── PublicationCard.jsx/.module.css# 论文条目（列表式，通讯作者*标注，DOI 外链）
    │   ├── NewsCard.jsx/.module.css       # 新闻卡片（16:9 封面/标签/标题/摘要；compact 模式）
    │   ├── Tag.jsx/.module.css            # 标签（primary/neutral/success/warning）
    │   ├── PageHeader.jsx/.module.css     # 内页标题区（C-05 统一版式）
    │   ├── Pagination.jsx/.module.css     # 分页（省略号策略）
    │   ├── EmptyState.jsx/.module.css     # 空态（无结果/建设中/404 复用）
    │   ├── RecruitBanner.jsx/.module.css  # 招生横幅（全站唯一琥珀色强调）
    │   ├── BackToTop.jsx/.module.css      # 返回顶部（滚动一屏后出现）
    │   ├── ScrollToTop.jsx                # 路由切换回顶部
    │   └── Icon.jsx                       # 线性 SVG 图标集（18 个图标）
    └── pages/                             # 页面（6 个主页面 + 4 个详情页 + 2 个辅助页）
        ├── Home.jsx/.module.css           # 首页（Hero/数据条/方向/成果+新闻/招生横幅）
        ├── About.jsx/.module.css          # 实验室介绍（概况/时间线/平台/荣誉）
        ├── Team.jsx/.module.css           # 团队成员（角色页签+hash 同步/成员网格/校友列表）
        ├── Research.jsx/.module.css       # 研究方向（2 列大卡）
        ├── Publications.jsx/.module.css   # 学术论文（组合筛选+URL 同步+分页+空态）
        ├── News.jsx/.module.css           # 新闻动态（分类页签/首条大版式/分页）
        ├── MemberDetail.jsx               # 成员详情（简介/教育经历/方向标签）
        ├── DirectionDetail.jsx            # 方向详情（概述/相关论文/相关成员）
        ├── PublicationDetail.jsx          # 论文详情（摘要/关键词/引用复制 GB/T 7714）
        ├── NewsDetail.jsx                 # 新闻详情（正文/上一篇下一篇/复制链接）
        ├── ComingSoon.jsx                 # 「建设中」占位（导师/项目/招生栏目）
        ├── NotFound.jsx/.module.css       # 404 页
        └── detail.module.css              # 详情页共享样式（面包屑/章节/个人/论文/新闻）
```

**文件统计**：组件 13 个、页面 12 个、数据文件 5 个、样式 21 个（CSS Modules）+ 1 全局。

---

## 3. 启动方式

```bash
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

其他命令：

```bash
npm run build    # 生产构建 → dist/
npm run preview  # 预览生产构建
```

> 注：若沙箱/服务器环境限制 `/root/.npm` 缓存写入，可附加 `--cache <可写目录>` 安装依赖。

### 已验证事项

| 验证项 | 结果 |
| --- | --- |
| `npm install` | ✅ 成功（依赖安装完成） |
| `npm run build` | ✅ 87 个模块转换成功，产物 `dist/`（JS 223KB / gzip 77KB） |
| `npm run dev` | ✅ 300ms 内就绪，无编译错误 |
| 路由可达性 | ✅ 12 条路由 + 通配页均返回 HTTP 200（SPA fallback 正常） |

---

## 4. 已实现功能

### 4.1 六个主页面（任务要求）

| 页面 | 路由 | 功能要点 |
| --- | --- | --- |
| 首页 | `/` | Hero 一句话定位 + 双 CTA；数据概览条；研究方向速览（4 卡）；最新成果（3 篇）+ 新闻速览（4 条）；招生横幅 |
| 实验室介绍 | `/about` | 图文概况；发展历程时间线（C-13）；平台设备卡；荣誉资质 |
| 团队成员 | `/team` | 5 类角色页签（默认博士生，URL hash 同步 `/team#phd`）；成员卡片网格（头像缺失时姓名首字占位）；校友紧凑列表；空态 |
| 研究方向 | `/research` | 5 个方向 2 列大卡（图标/摘要/关键词）→ 方向详情 |
| 学术论文 | `/publications` | 类型页签 + 年份/方向/排序下拉组合筛选（URL 参数同步）；关键词搜索（导航搜索框联动，`?q=`）；每页 10 条分页；空态重置；共 N 篇计数 |
| 新闻动态 | `/news` | 5 类分类页签；首条大版式置顶；3 列卡片网格；分页 |

### 4.2 补充实现（对应 PRD 5.x 详情页与通用需求）

- **详情页**：成员、研究方向、论文、新闻 4 类详情页（含面包屑 C-09）；
- **论文详情**：摘要、关键词、GB/T 7714 引用一键复制（带降级方案与成功提示）；
- **新闻详情**：正文渲染、上一篇/下一篇、复制链接；
- **导航搜索**：按论文标题/摘要/关键词检索，结果直达论文列表页；
- **辅助页**：404 页（F-05）、「建设中」占位页（导师介绍/科研项目/招生招聘，对应 PRD 空态与导航完整性）；
- **全局交互**：吸顶导航（滚动压缩）、移动端汉堡抽屉、返回顶部、焦点环、`prefers-reduced-motion` 降级。

### 4.3 设计规范落地（design.md）

- 设计令牌：`global.css` 完整实现第 2 节色板（学者蓝 `#1D4E89`、唯一琥珀强调色）、字号阶梯（clamp 自适应）、间距/圆角/阴影；
- 组件：C-01~C-21 中导航、页脚、卡片、标签、页签、筛选栏、分页、时间线、空态、横幅、返回顶部、面包屑均已实现；
- 响应式：桌面 4 列 / 平板 2~3 列 / 移动 1~2 列，断点 1200 / 768；
- 可访问性：语义化标签（header/nav/main/footer/article）、唯一 h1、图片 alt、`aria-current`/`aria-selected`/`aria-live`、对比度符合色板校验。

---

## 5. 已知限制与后续建议

| 项 | 说明 |
| --- | --- |
| 占位图 | 成员照片/新闻封面使用渐变 + 首字/图标占位，正式内容就绪后替换为真实图片（PRD R1） |
| 导师/项目/招生栏目 | 本期按任务范围实现为「建设中」占位页，路由已预留（`/faculty`、`/projects`、`/join-us`） |
| 语言切换 | 导航中「中/EN」为静态展示（PRD Q1：英文框架占位，翻译另行排期） |
| 站内搜索 | 本期覆盖论文标题/摘要/关键词（PRD Q5），全文检索列入 V1.1 |
| 部署 | 静态托管即可（Nginx 需配置 SPA fallback 到 `index.html`） |

---

*本报告与 `frontend/` 代码一致，如代码后续变更请同步更新本报告。*
