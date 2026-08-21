# 科研内容体系架构方案 —— 互联网基础技术实验室官网

| 项目 | 内容 |
| --- | --- |
| 编写角色 | Research Content Architect Agent |
| 编写日期 | 2026-08-21 |
| 覆盖页面 | 首页（/）、实验室介绍（/about）、研究方向（/research、/research/:id） |
| 依据数据 | `frontend/src/data/papers.json`（16 篇真实论文）、`members.json`、`site.json`、`directions.json`、`news.json`、`docs/requirements.md`、`docs/design.md`、`artifacts/data_sources.md` |
| 依据公开资料 | 计算所官网新闻与部门介绍、中国科学院大学教师主页（李晓东）、计算所人才库（李晓东/彭博韬）、彭博韬个人主页（见 §8 溯源表） |
| 交付性质 | 内容与数据结构建议（不含代码）；JSON 为数据建议，可直接交给数据工程师/前端加载 |

---

## 目录

1. [内容策略总则与设计决策](#1-内容策略总则与设计决策)
2. [内容体系总览](#2-内容体系总览)
3. [首页展示文案](#3-首页展示文案)
4. [/about 页面内容与数据模型](#4-about-页面内容与数据模型)
5. [/research 页面内容与数据模型](#5-research-页面内容与数据模型)
6. [JSON 数据结构建议](#6-json-数据结构建议)
7. [数据清理与迁移步骤（无代码）](#7-数据清理与迁移步骤无代码)
8. [事实溯源与待确认清单](#8-事实溯源与待确认清单)

---

## 1. 内容策略总则与设计决策

### 1.1 三条硬约束 → 五项设计决策

| 约束 | 设计决策 |
| --- | --- |
| 不虚构不存在的研究方向 | **决策 D1**：删除 5 个虚构方向（dir1–dir5，计算机视觉/机器学习/机器人/大模型/边缘智能）与 14 篇虚构论文（示例占位数据）。全部保留数据均可在 `papers.json`、`members.json` 或公开资料中溯源。 |
| 以「数据互操作」「互联网基础技术」为核心定位 | **决策 D2**：内容体系引入「两条研究主线」层级 —— 主线 A「互联网基础技术」（基础设施层）、主线 B「数据互操作」（数据层），下辖 4 个研究方向（§5.1）。 |
| 面向高校实验室官网风格、避免商业宣传语言 | **决策 D3**：全站文案采用事实陈述 + 学术术语，禁用营销化表述（§1.3 禁忌词表）。 |
| 现有前端字段兼容 | **决策 D4**：`directions.json` 保留 `id/icon/title/en/summary/keywords/content` 字段不变，`papers.json`/`members.json` 通过 `research_direction` 关联的机制不变；新增字段（`order/pillar/lead/methods/featuredPapers/highlights`）为增量。方向 id 保持 `dir6–dir9` 不变，仅改标题与内容，避免破坏论文/成员关联。 |
| 事实可复核 | **决策 D5**：每段文案标注来源（论文 id / 成员档案 / 公开新闻 URL），无法核实的信息一律标记「待确认」，不代填（§8）。 |

### 1.2 双主线定位（核心定位文案）

> 实验室以「**互联网基础技术**」与「**数据互操作**」为两条研究主线：
>
> - **互联网基础技术（Internet Fundamental Technology）** —— 面向域名系统（DNS）、标识解析与网络安全等互联网基础问题，保障互联网基础设施的稳定与安全可信运行；
> - **数据互操作（Data Interoperation）** —— 面向数据要素化与流通需求，研究数据互操作、授权合规与数据管理技术，支撑数据在跨主体、跨系统间的安全共享与可信流通。

两条主线对应 4 个研究方向，关系如下：

```
互联网基础技术实验室（依托计算所网络技术研究中心，2016 年 CNNIC 与计算所共建）
│
├── 主线 A：互联网基础技术（基础设施层）
│     ├── dir6 DNS 与标识解析          （工程/标准成果为主，论文待补充）
│     └── dir7 网络安全与隐私保护      （7 篇论文）
│
└── 主线 B：数据互操作（数据层）
      ├── dir8 数据互操作              （7 篇论文）
      └── dir9 数据管理与分析          （3 篇论文，为数据平台提供底层支撑）

沿革：2011-12 开放实验室发起设立 → 2016-10 实验室成立（国家网信办支持下由计算所设立）→ 2020-07 伏羲智库参与共建（详见 §4.3）。
```

### 1.3 文案规范与禁忌词

**规范**：陈述句为主；数字必须与实际数据一致；术语首次出现用中英对照（如 域名系统（Domain Name System, DNS））；不出现评价性形容词修饰自身成果。

**禁忌词（避免商业宣传语言）**：领先、一流、顶尖、世界级、颠覆、赋能、打造、生态、闭环、首家、最大、突破性、里程碑式、显著优于（论文摘要除外）。

---

## 2. 内容体系总览

### 2.1 页面 → 内容类型 → 数据文件映射

| 页面 | 内容类型 | 数据文件（现有） | 数据文件（建议新增/调整） |
| --- | --- | --- | --- |
| 首页 / | 定位文案、数据条、方向卡、最新论文、新闻、招生横幅 | `site.json`、`directions.json`、`papers.json`、`news.json` | `papers.json` 增 `featured` 标记（可选） |
| 实验室介绍 /about | 概况、双主线定位、发展历程、隶属、平台、荣誉、联系 | `site.json`（about/milestones/honors/contact） | `site.json` 增 `about.lead`、`positioning`、`affiliation`（§6.1） |
| 研究方向 /research | 页面导语、双主线、方向卡片 | `directions.json` | 新增 `research.json`（页面导语 + pillars） |
| 方向详情 /research/:id | 概述、关键技术点、代表性成果、相关论文 | `directions.json`、`papers.json` | `directions.json` 增 `lead/methods/highlights/featuredPapers` |

### 2.2 关联机制（保持不变）

- 论文 → 方向：`papers[].research_direction: ["dir8", ...]`
- 成员 → 方向：`members[].research_direction: ["dir6", ...]`（用于成员/导师详情页方向标签；**方向详情页已不再展示「相关成员」区块**，2026-08-21 按负责人意见移除）
- 方向详情页由前端按方向 id 自动聚合「相关论文」，无需额外数据文件。

### 2.3 方向-论文-成员统计（16 篇真实论文）

| 方向 | 论文数 | 论文 id | 相关成员 |
| --- | --- | --- | --- |
| dir6 DNS 与标识解析 | 0（工程/标准成果） | — | 李晓东 |
| dir7 网络安全与隐私保护 | 7 | ti-dns-trustcom-2023、privsketch-dexa-2023、illegal-webpage-bigdata-2022、dns-backbone-comnet-2024、streaming-data-iotj-2024、defiad-trustcom-2025、polaris-trustcom-2025（与 dir8 双归属） | 李晓东、李颖、符玉梵、代兆君、张爱瑶 |
| dir8 数据互操作 | 7 | dia-compsac-2023、flexauth-trustcom-2023、disauth-comnet-2024、cbcms-bigdata-2024、dominate-data-wwwj-2025、polaris-trustcom-2025、structured-policy-ist-2026 | 李晓东、彭博韬、李颖、魏久麒、张爱瑶、庄智显 |
| dir9 数据管理与分析 | 3 | det-lsh-vldb-2024、subspace-collision-sigmod-2025、pdet-lsh-tkde-2026 | 彭博韬、魏久麒 |

> 说明：dir6 在现有 16 篇论文清单中无直接论文，其成果以工程与标准贡献呈现（§5.3.1）；该方向论文清单标记为「待补充」，不虚构论文。

---

## 3. 首页展示文案

> 以下为首页各模块的完整文案稿，字段名对应 §6.1 `site.json` 建议结构。

### 3.1 Hero 区

- **机构眉题（overline）**：中国科学院计算技术研究所
- **荣誉徽章（badge，取 `honors[0].title`）**：互联网域名管理技术国家工程实验室
- **主标题（tagline）**：互联网基础技术 · 数据互操作
- **副标题（heroSubtitle）**：

> 实验室面向域名系统（DNS）、标识解析、网络安全与数据互操作等互联网基础问题，开展基础研究与关键技术攻关，支撑互联网基础设施的安全可信运行与数据的合规流通。

- **CTA**：了解研究方向（→ /research）；加入我们（→ /join-us）
- **方向快捷入口（chips，取前 3 个方向）**：DNS 与标识解析 / 网络安全与隐私保护 / 数据互操作

**备选主标题**（如负责人希望弱化标语感）：
1. 「构建可信的互联网基础设施」+ 副标题不变；
2. 「面向数据互操作的互联网基础技术研究」。

### 3.2 数据概览条（stats，数字均与现有数据一致）

| 教师 | 在读研究生 | 代表性论文 | 研究方向 |
| --- | --- | --- | --- |
| 2 人 | 16 人 | 16 篇 | 4 个 |

### 3.3 研究方向速览（4 张卡片，文案见 §5.3）

### 3.4 最新成果（取年份最新的 3 篇，去除虚构论文后为）

1. **PDET-LSH: Scalable In-Memory Indexing for High-Dimensional Approximate Nearest Neighbor Search with Quality Guarantees** — IEEE TKDE, 2026
2. **Structured Policy Modeling and Context-Aware Generation for Multi-Jurisdictional Compliance in Global Software Systems** — Information and Software Technology, 2026
3. **Subspace Collision: An Efficient and Accurate Framework for High-dimensional Approximate Nearest Neighbor Search** — SIGMOD 2025

> 建议：首页「最新成果」如需人工策展而非按年份硬取，可在 `papers.json` 为 5 篇代表作加 `"featured": true`（见 §6.4），前端优先展示 `featured` 论文。

### 3.5 新闻速览（`news.json` 已清空，待真实内容填充）

原 `frontend/src/data/news.json` 中的 12 条新闻为虚构占位内容，已按负责人意见清空为 `[]`（首页新闻模块将显示空态「内容更新中」）。以下 3 条为**可溯源草稿**（日期均待确认，发布前需核对真实日期与来源），后续可按需填充：

| id | 标题 | 分类 | 依据 |
| --- | --- | --- | --- |
| sigmod-2025-accept | 课题组论文被 SIGMOD 2025 录用 | 获奖荣誉 | subspace-collision-sigmod-2025（DOI 已核验） |
| wwwj-2025-interop | 实验室在数据互操作方向发表论文 | 实验室动态 | dominate-data-wwwj-2025 |
| spark-award-2025 | 彭博韬副研究员获华为「火花奖」 | 获奖荣誉 | members.json（彭博韬档案） |

> 填充注意：新闻标题/日期/来源必须真实可溯（PRD 7.4 内容质量要求）；论文录用新闻的日期以录用通知或会议官网为准，不得用论文发表年份代替。

### 3.6 招生招聘横幅

- **标题**：欢迎加入互联网基础技术实验室
- **描述**：长期招收硕士、博士研究生与博士后，研究方向涵盖互联网基础技术、网络安全与数据互操作。
- **CTA**：查看招生信息（→ /join-us）

---

## 4. /about 页面内容与数据模型

### 4.1 页面目标与内容模块

**页面目标**：建立实验室的完整认知与信任 —— 是什么机构、为什么做这两条主线、有什么积累、如何联系。

| 模块 | 内容 | 数据来源 |
| --- | --- | --- |
| 页面标题区 | 实验室介绍 / About the Lab | 静态 |
| 实验室概况 | lead（一句话定位）+ 4 段正文 | `site.about` |
| 两条研究主线 | 主线 A/B 名称、英文、描述、对应方向 | `site.positioning`（新增） |
| 数据概览 | 教师/学生/论文/方向 | `site.stats` |
| 发展历程 | 时间线（成立、战略合作、成果产出、获奖） | `site.milestones` |
| 隶属与共建 | 依托单位、共建单位、历史沿革 | `site.affiliation`（新增） |
| 平台与数据资源 | 数据平台（待确认） | `site.about.equipment`（重定义） |
| 荣誉与资质 | 团队级 + 成员级（标注个人） | `site.honors`（增 scope） |
| 联系方式 | 邮箱（已知两位导师）、电话/地址（待确认） | `site.contact` |

### 4.2 实验室概况文案（lead + 4 段）

**lead（一句话定位）**：

> 面向互联网基础资源与数据流通的基础研究实验室，以「互联网基础技术」与「数据互操作」为两条研究主线。

**正文段落**：

> **P1（建制与定位）** 互联网基础技术实验室成立于 2016 年 10 月，在国家网信办支持下由中国科学院计算技术研究所设立，依托计算所网络技术研究中心运行，李晓东研究员任实验室主任。实验室面向互联网基础资源与关键基础设施，围绕域名系统（DNS）、标识解析、网络安全与数据互操作等方向开展基础研究与关键技术攻关。
>
> **P2（沿革与积累）** 实验室的研究可追溯至 2011 年 12 月，在中国科学院支持下，由时任中国互联网络信息中心（CNNIC）副主任李晓东研究员推动发起设立的开放实验室；2020 年 7 月，伏羲智库参与共建实验室。实验室团队长期参与国家互联网基础资源的建设与运行：曾负责国家域名全球服务平台规划建设与关键系统研制，推动中文域名标准化及“.中国”国家顶级域名入根，参与创建互联网域名管理技术国家工程实验室，在域名数据监控、解析性能评估与安全分析等方面积累了长期的研究基础。
>
> **P3（当前研究）** 当前，实验室以「数据互操作」与「互联网基础技术」为两条主线：前者面向数据要素化与流通需求，研究数据与应用解耦下的去中心化数据互操作、跨域授权与跨境数据合规技术；后者面向互联网基础设施，研究 DNS 安全、域名滥用检测与隐私保护技术，并以高维数据索引与检索等数据管理技术为两者提供底层支撑。相关成果发表于 SIGMOD、VLDB、TrustCom 等国际会议及 IEEE TKDE、WWW Journal、Computer Networks 等期刊。
>
> **P4（队伍与育人）** 实验室现有研究人员 2 人、在读研究生 16 人，形成以研究员为带头人、青年科研人员为骨干、研究生为主力的研究梯队。实验室坚持研究面向真实基础设施问题，注重理论方法与工程实践结合，长期招收对互联网基础技术、网络安全与数据互操作方向感兴趣的硕士、博士研究生与博士后。

### 4.3 发展历程文案（时间线）

| 年份 | 标题 | 描述 | 图片 | 来源 |
| --- | --- | --- | --- | --- |
| 2011-12 | 开放实验室发起设立 | 在中国科学院支持下，由时任中国互联网络信息中心（CNNIC）副主任李晓东研究员推动发起设立的开放实验室。 | — | 负责人提供（权威沿革） |
| 2016-10 | 互联网基础技术实验室成立 | 在国家网信办支持下，中国科学院计算技术研究所成立互联网基础技术实验室。 | — | 负责人提供（权威沿革） |
| 2020-07 | 伏羲智库参与共建 | 伏羲智库参与共建计算所互联网基础技术实验室。 | 签约仪式照片（待插入） | 负责人提供（权威沿革） |

**2020 节点图片插入位置**：

- **文件侧**：图片放入 `frontend/public/images/milestones/2020-cofound-signing.jpg`。`public/` 是 Vite 静态资源目录，会原样映射到站点根路径，因此 JSON 中以 `/images/milestones/2020-cofound-signing.jpg` 引用即可（无需 import）。
- **数据侧**：`site.json` 中 2020 条目新增两个字段（见 §6.1 示例）：`"image": "/images/milestones/2020-cofound-signing.jpg"`、`"imageCaption": "2020 年伏羲智库参与共建签约仪式"`。
- **页面侧**：`/about` 时间线中该条目旁/下方展示图片。当前 `About.jsx` 的时间线仅渲染 `year/title/desc`，需前端按 `image` 字段做一处增量渲染（可选：图左文右或文上图下，移动端单列）。
- **图片规范**：建议 16:9（1200×675），WebP/JPEG，发布前压缩。

> 时间线以负责人提供的权威沿革为准；论文产出、获奖等「成果类」节点（如 2022–2026 论文产出、2025 火花奖）如需展示，由负责人确认后另行追加。

### 4.4 荣誉与资质文案（标注层级）

| 标题 | 描述 | 层级 |
| --- | --- | --- |
| 互联网域名管理技术国家工程实验室 | 实验室团队参与创建，李晓东研究员曾任主任 | team |
| 国务院特殊津贴 | 李晓东研究员 | member |
| 中国青年五四奖章 | 李晓东研究员 | member |
| 中国软件行业十大杰出青年 | 李晓东研究员 | member |
| 世界经济论坛全球青年领袖（YGL） | 李晓东研究员 | member |
| 华为「火花奖」 | 彭博韬副研究员（2025） | member |
| 中国互联网协会青年专家 | 彭博韬副研究员（2021） | member |

> 说明：`site.honors[0]` 同时被首页 Hero 徽章引用，故将团队级「国家工程实验室」置首。

### 4.5 平台与数据资源（重定义，替代虚构的 GPU/机器人）

| 名称 | 描述 | 状态 |
| --- | --- | --- |
| 域名解析与被动 DNS 数据 | 支撑域名滥用检测等研究（数据集规模与获取方式待确认） | 待确认 |
| 高性能计算集群 | 支撑高维数据索引与检索实验（配置待确认） | 待确认 |

> 现有 `site.about.equipment` 中的「128 卡 GPU 集群」「移动机器人平台」为虚构内容，必须替换；本节为占位草案，最终以实验室实际平台为准。

### 4.6 联系方式

- 邮箱：`xl@ict.ac.cn`（李晓东，来自成员档案）、`pengbotao@ict.ac.cn`（彭博韬，来自成员档案）
- 实验室公共邮箱、电话：**待确认**（现 `icp-lab@example.edu.cn`、`010-1234-5678` 为虚构占位）
- 地址：北京市海淀区中关村科学院南路 6 号 · 中国科学院计算技术研究所（**待确认**，以计算所官方信息公开页为准）

---

## 5. /research 页面内容与数据模型

### 5.1 页面结构与导语文案

**页面结构（建议）**：页面标题区 → 导语（两条主线说明）→ 主线 A 区块（2 张方向卡）→ 主线 B 区块（2 张方向卡）→（详情页另见 §5.4）。

**页面导语（research.json.page.intro）**：

> 实验室以「互联网基础技术」与「数据互操作」为两条研究主线，下设四个研究方向，分别面向互联网基础设施的安全稳定运行与数据的合规流通。各方向在问题定义、技术与数据上相互支撑。

### 5.2 两条主线（pillars）

| id | 主线 | 英文 | 描述 | 包含方向 |
| --- | --- | --- | --- | --- |
| internet-infra | 互联网基础技术 | Internet Fundamental Technology | 面向域名系统、标识解析与网络安全等互联网基础问题，保障互联网基础设施的稳定与安全可信运行。 | dir6, dir7 |
| data-interop | 数据互操作 | Data Interoperation | 面向数据要素化与流通需求，研究数据互操作、授权合规与数据管理技术，支撑数据的安全共享与可信流通。 | dir8, dir9 |

### 5.3 四个研究方向的完整文案

#### 5.3.1 dir6 —— DNS 与标识解析（主线 A）

- **英文**：DNS & Identifier Resolution
- **摘要（summary，卡片用，≤40 字）**：研究域名系统（DNS）与互联网标识解析的关键技术，支撑互联网基础资源的规划、建设与稳定运行。
- **概述（lead，详情页首段）**：域名系统是互联网的基础命名与寻址设施。本方向研究 DNS 与标识解析的规划建设、性能评估与标准化，为互联网基础资源的稳定运行提供支撑。
- **正文（content）**：
  1. 本方向面向域名系统（DNS）与互联网标识解析等基础性问题，覆盖域名基础资源的规划建设、解析性能与服务质量评估、中文域名与国际化域名的标准化推广，以及网络标识体系的演进研究。
  2. 团队曾负责国家域名全球服务平台规划建设与关键系统研制，推动中文域名标准化及“.中国”国家顶级域名入根，参与创建互联网域名管理技术国家工程实验室，在域名数据监控、解析性能与安全评估等方面积累了长期的研究基础。
  3. 该方向以工程成果与标准贡献为主；其延伸的安全与数据问题，由实验室的「网络安全与隐私保护」「数据互操作」方向承接（论文成果见对应方向）。
- **关键词（keywords）**：域名系统、DNS、标识解析、中文域名、互联网基础资源
- **关键技术点（methods）**：域名数据监控、解析性能评估、域名标准化、标识解析技术
- **代表性成果（highlights，替代论文区）**：
  - 国家域名全球服务平台 —— 负责规划建设与关键系统研制（platform）
  - 中文域名标准化与“.中国”入根 —— 推动中文域名标准化及国家顶级域名入根（standard）
  - 互联网域名管理技术国家工程实验室 —— 参与创建，李晓东研究员曾任主任（platform）
- **相关论文**：暂无（当前收录清单）；标注「论文清单待补充」。

#### 5.3.2 dir7 —— 网络安全与隐私保护（主线 A）

- **英文**：Cybersecurity & Privacy
- **摘要**：研究 DNS 安全、域名滥用检测与隐私保护的流数据采集技术，保障互联网基础设施的安全可信运行。
- **概述**：本方向聚焦互联网基础设施的安全问题，研究 DNS 缓存投毒等攻击的防御机制、基于大规模解析数据的域名滥用早期检测，以及隐私保护的流数据采集与处理协议。
- **正文**：
  1. DNS 是互联网的关键基础设施，也是网络攻击的高发面。本方向研究 DNS 缓存投毒等攻击的检测与防御机制，以及域名滥用行为的早期识别方法。
  2. 代表性工作包括：基于区块链与激励机制的 DNS 可信解析架构（TI-DNS 系列，TrustCom 2023 / Computer Networks 2024）、面向注册阶段域名滥用检测的深度特征交互框架（DeFiAD，TrustCom 2025）、基于本地差分隐私与草图协议的隐私流数据采集协议（PrivSketch / PSF，DEXA 2023 / IEEE IoT Journal 2024）、基于可验证身份与策略授权的跨域访问控制（POLARIS，TrustCom 2025，与 dir8 双归属）等。
- **关键词**：DNS 安全、域名滥用检测、区块链可信解析、隐私保护、异常检测
- **关键技术点**：区块链可信解析、深度特征交互、域名滥用检测、本地差分隐私、草图协议
- **相关论文（7 篇）**：见 §2.3 与 §6.5。

#### 5.3.3 dir8 —— 数据互操作（主线 B，核心方向）

- **英文**：Data Interoperation
- **摘要**：研究数据与应用解耦背景下的互操作、授权与合规技术，支撑跨主体、跨系统的数据安全共享与可信流通。
- **概述**：数据互操作是本实验室的核心研究方向，聚焦数据与应用解耦后的互操作、授权与合规问题，为数据要素的合规流通提供技术支撑。
- **正文**：
  1. 本方向面向数据要素化与数据流通需求，研究数据与应用解耦场景下的去中心化数据互操作方案、可验证身份与策略驱动的跨域授权机制，以及跨境数据传输的合规建模方法。
  2. 代表性工作包括：数据自持导向的去中心化互操作架构（DIA，COMPSAC 2023；Dominate Data by Yourself，WWW Journal 2025）、基于 DNS 的授权框架（DiSAuth，Computer Networks 2024）、跨域访问控制体系（FlexAuth / POLARIS，TrustCom 2023 / 2025）、跨境数据合规管理系统（CBCMS，IEEE BigData 2024）与多司法辖区合规策略建模（Information and Software Technology 2026）等。
- **关键词**：数据互操作、数据授权、数据所有权、访问控制、跨境数据合规
- **关键技术点**：去中心化数据互操作、可验证身份、策略授权、跨境数据合规建模、数据所有权
- **相关论文（7 篇）**：见 §2.3 与 §6.5。

#### 5.3.4 dir9 —— 数据管理与分析（主线 B，支撑方向）

- **英文**：Data Management & Analytics
- **摘要**：研究大规模高维数据与时间序列数据的高性能索引、检索与分析技术。
- **概述**：本方向研究大规模高维数据与时间序列数据的管理与分析系统，重点关注具有理论保证的近似最近邻（ANN）检索、内存索引与并行化技术，为数据平台建设提供底层支撑。
- **正文**：
  1. 高维数据检索是推荐系统、数据平台与互操作系统共用的底层技术。本方向研究具有查询质量理论保证的近似最近邻检索方法，以及面向多核 CPU 的并行内存索引技术。
  2. 代表性工作包括：基于动态编码树的局部敏感哈希方案（DET-LSH，VLDB 2024；PDET-LSH，IEEE TKDE 2026）、面向高维数据的子空间碰撞检索框架（Subspace Collision，SIGMOD 2025）等，在索引与查询效率上较现有方法取得数量级提升。
- **关键词**：近似最近邻搜索、局部敏感哈希、内存索引、高维数据、并行计算
- **关键技术点**：近似最近邻搜索、局部敏感哈希、动态编码树、子空间碰撞、多核并行
- **相关论文（3 篇）**：见 §2.3 与 §6.5。

### 5.4 方向详情页模型（/research/:id）

| 区块 | 字段 | 说明 |
| --- | --- | --- |
| 标题区 | title / en | 现有 |
| 关键词 | keywords | 现有 |
| 方向概述 | lead + content | `lead` 为新增首段（摘要性总起），`content` 保持段落数组 |
| 关键技术点 | methods | 新增，标签组展示 |
| 代表性成果 | highlights | 新增，`type: platform/standard/project`；dir6 等无论文方向由此承接 |
| 相关论文 | featuredPapers（可选）+ 自动聚合 | 默认按 `research_direction` 聚合；`featuredPapers` 可指定精选顺序 |

> 注：「相关成员」区块已于 2026-08-21 按负责人意见从方向详情页移除（认为意义不大）；`members[].research_direction` 数据保留，仍用于成员/导师详情页的方向标签展示。

---

## 6. JSON 数据结构建议

> 说明：以下 JSON 为**建议数据结构与完整示例内容**（数据，非代码）。现有前端字段全部保留；新增字段用 `▲` 标注。`site.json` 给出完整文件，`research.json`、`directions.json` 给出完整示例，`papers.json` 仅给出变更说明。

### 6.1 site.json（完整建议；覆盖首页与 /about）

```json
{
  "lab": {
    "nameZh": "互联网基础技术实验室",
    "nameEn": "Internet Fundamental Technology Laboratory",
    "shortName": "互联网基础技术实验室",
    "university": "中国科学院计算技术研究所",
    "department": "网络技术研究中心",
    "tagline": "互联网基础技术 · 数据互操作",
    "heroSubtitle": "实验室面向域名系统（DNS）、标识解析、网络安全与数据互操作等互联网基础问题，开展基础研究与关键技术攻关，支撑互联网基础设施的安全可信运行与数据的合规流通。"
  },
  "stats": [
    { "label": "教师", "value": 2, "suffix": "人" },
    { "label": "在读研究生", "value": 16, "suffix": "人" },
    { "label": "代表性论文", "value": 16, "suffix": "篇" },
    { "label": "研究方向", "value": 4, "suffix": "个" }
  ],
  "about": {
    "title": "实验室概况",
    "lead": "面向互联网基础资源与数据流通的基础研究实验室，以「互联网基础技术」与「数据互操作」为两条研究主线。",
    "paragraphs": [
      "互联网基础技术实验室成立于 2016 年 10 月，在国家网信办支持下由中国科学院计算技术研究所设立，依托计算所网络技术研究中心运行，李晓东研究员任实验室主任。实验室面向互联网基础资源与关键基础设施，围绕域名系统（DNS）、标识解析、网络安全与数据互操作等方向开展基础研究与关键技术攻关。",
      "实验室的研究可追溯至 2011 年 12 月，在中国科学院支持下，由时任中国互联网络信息中心（CNNIC）副主任李晓东研究员推动发起设立的开放实验室；2020 年 7 月，伏羲智库参与共建实验室。实验室团队长期参与国家互联网基础资源的建设与运行：曾负责国家域名全球服务平台规划建设与关键系统研制，推动中文域名标准化及“.中国”国家顶级域名入根，参与创建互联网域名管理技术国家工程实验室，在域名数据监控、解析性能评估与安全分析等方面积累了长期的研究基础。",
      "当前，实验室以「数据互操作」与「互联网基础技术」为两条主线：前者面向数据要素化与流通需求，研究数据与应用解耦下的去中心化数据互操作、跨域授权与跨境数据合规技术；后者面向互联网基础设施，研究 DNS 安全、域名滥用检测与隐私保护技术，并以高维数据索引与检索等数据管理技术为两者提供底层支撑。相关成果发表于 SIGMOD、VLDB、TrustCom 等国际会议及 IEEE TKDE、WWW Journal、Computer Networks 等期刊。",
      "实验室现有研究人员 2 人、在读研究生 16 人，形成以研究员为带头人、青年科研人员为骨干、研究生为主力的研究梯队。实验室坚持研究面向真实基础设施问题，注重理论方法与工程实践结合，长期招收对互联网基础技术、网络安全与数据互操作方向感兴趣的硕士、博士研究生与博士后。"
    ],
    "equipment": [
      { "name": "域名解析与被动 DNS 数据", "desc": "支撑域名滥用检测等研究（数据集规模与获取方式待确认）", "status": "pending" },
      { "name": "高性能计算集群", "desc": "支撑高维数据索引与检索实验（配置待确认）", "status": "pending" }
    ]
  },
  "positioning": {
    "title": "两条研究主线",
    "pillars": [
      {
        "id": "internet-infra",
        "order": 1,
        "name": "互联网基础技术",
        "en": "Internet Fundamental Technology",
        "desc": "面向域名系统、标识解析与网络安全等互联网基础问题，保障互联网基础设施的稳定与安全可信运行。",
        "directions": ["dir6", "dir7"]
      },
      {
        "id": "data-interop",
        "order": 2,
        "name": "数据互操作",
        "en": "Data Interoperation",
        "desc": "面向数据要素化与流通需求，研究数据互操作、授权合规与数据管理技术，支撑数据的安全共享与可信流通。",
        "directions": ["dir8", "dir9"]
      }
    ]
  },
  "milestones": [
    {
      "year": "2011",
      "month": "12",
      "title": "开放实验室发起设立",
      "desc": "在中国科学院支持下，由时任中国互联网络信息中心（CNNIC）副主任李晓东研究员推动发起设立的开放实验室。",
      "source": "负责人提供（权威沿革）"
    },
    {
      "year": "2016",
      "month": "10",
      "title": "互联网基础技术实验室成立",
      "desc": "在国家网信办支持下，中国科学院计算技术研究所成立互联网基础技术实验室。",
      "source": "负责人提供（权威沿革）"
    },
    {
      "year": "2020",
      "month": "07",
      "title": "伏羲智库参与共建",
      "desc": "伏羲智库参与共建计算所互联网基础技术实验室。",
      "image": "/images/milestones/2020-cofound-signing.jpg",
      "imageCaption": "2020 年伏羲智库参与共建签约仪式",
      "source": "负责人提供（权威沿革）"
    }
  ],
  "affiliation": {
    "unit": "中国科学院计算技术研究所 · 网络技术研究中心",
    "coFounded": "中国互联网络信息中心（CNNIC）",
    "history": "2016 年由 CNNIC 与计算所共建，2018 年对外公布；依托计算所网络技术研究中心运行。"
  },
  "honors": [
    { "title": "互联网域名管理技术国家工程实验室", "desc": "实验室团队参与创建，李晓东研究员曾任主任", "scope": "team" },
    { "title": "国务院特殊津贴", "desc": "李晓东研究员", "scope": "member" },
    { "title": "中国青年五四奖章", "desc": "李晓东研究员", "scope": "member" },
    { "title": "中国软件行业十大杰出青年", "desc": "李晓东研究员", "scope": "member" },
    { "title": "世界经济论坛全球青年领袖（YGL）", "desc": "李晓东研究员", "scope": "member" },
    { "title": "华为「火花奖」", "desc": "彭博韬副研究员（2025）", "scope": "member" },
    { "title": "中国互联网协会青年专家", "desc": "彭博韬副研究员（2021）", "scope": "member" }
  ],
  "recruit": {
    "title": "欢迎加入互联网基础技术实验室",
    "desc": "长期招收硕士、博士研究生与博士后，研究方向涵盖互联网基础技术、网络安全与数据互操作。",
    "cta": "查看招生信息"
  },
  "nav": [
    { "label": "首页", "path": "/" },
    { "label": "实验室介绍", "path": "/about" },
    { "label": "导师介绍", "path": "/faculty" },
    { "label": "团队成员", "path": "/team" },
    { "label": "研究方向", "path": "/research" },
    { "label": "科研项目", "path": "/projects" },
    { "label": "学术论文", "path": "/publications" },
    { "label": "新闻动态", "path": "/news" },
    { "label": "招生招聘", "path": "/join-us" }
  ],
  "contact": {
    "email": "xl@ict.ac.cn",
    "email2": "pengbotao@ict.ac.cn",
    "phone": "待确认",
    "address": "北京市海淀区中关村科学院南路 6 号 · 中国科学院计算技术研究所（待确认）",
    "applyEmail": "待确认"
  },
  "friendLinks": [
    { "label": "中国科学院计算技术研究所", "url": "https://www.ict.ac.cn" },
    { "label": "网络技术研究中心", "url": "http://www.ict.ac.cn/jssgk/zzjg/kyxt/wljsyjzx/js/" },
    { "label": "中国互联网络信息中心（CNNIC）", "url": "https://www.cnnic.cn" },
    { "label": "国家自然科学基金委员会", "url": "https://www.nsfc.gov.cn" }
  ]
}
```

**字段说明**：

| 字段 | 状态 | 说明 |
| --- | --- | --- |
| `lab.department` | ▲ 新增 | 隶属部门，导航/页脚可选展示 |
| `lab.nameEn` / `lab.shortName` | 调整 | **无官方英文名/短名（负责人确认）**：不设 IFTL；`shortName` 以中文全称兜底（导航 Logo 显示中文全称）；`nameEn` 保留为工作翻译，不对外宣称官方 |
| `about.lead` | ▲ 新增 | 概况区一句话定位（`About.jsx` 可在段落前渲染） |
| `positioning` | ▲ 新增 | /about 双主线模块数据 |
| `affiliation` | ▲ 新增 | 隶属与共建模块 |
| `milestones[].month` | ▲ 新增 | 月份（可选，用于更精确的时间线展示） |
| `milestones[].image` / `imageCaption` | ▲ 新增 | 节点配图（如 2020 签约照片），图片放 `frontend/public/images/milestones/`，JSON 中以 `/images/...` 引用 |
| `milestones[].source` | ▲ 新增 | 事实来源标注（可仅用于后台维护，前端可不展示） |
| `honors[].scope` | ▲ 新增 | `team`/`member`，供页面分组展示 |
| `about.equipment` | 重定义 | 替换虚构设备（§4.5） |
| `contact` | 重定义 | `email` 保持单一字符串以兼容 Footer；`email2` 为第二位导师邮箱 |

### 6.2 research.json（新增；/research 页面导语 + 双主线）

```json
{
  "page": {
    "title": "研究方向",
    "en": "Research Directions",
    "intro": "实验室以「互联网基础技术」与「数据互操作」为两条研究主线，下设四个研究方向，分别面向互联网基础设施的安全稳定运行与数据的合规流通。各方向在问题定义、技术与数据上相互支撑。"
  },
  "pillars": [
    {
      "id": "internet-infra",
      "order": 1,
      "title": "互联网基础技术",
      "en": "Internet Fundamental Technology",
      "desc": "面向域名系统、标识解析与网络安全等互联网基础问题，保障互联网基础设施的稳定与安全可信运行。",
      "directions": ["dir6", "dir7"]
    },
    {
      "id": "data-interop",
      "order": 2,
      "title": "数据互操作",
      "en": "Data Interoperation",
      "desc": "面向数据要素化与流通需求，研究数据互操作、授权合规与数据管理技术，支撑数据的安全共享与可信流通。",
      "directions": ["dir8", "dir9"]
    }
  ]
}
```

> 说明：`site.positioning` 与 `research.json.pillars` 内容一致，分别服务 /about 与 /research 两页；若希望单一数据源，可只保留 `research.json` 并在 /about 中引用（由前端或构建期合并，属实现选择）。

### 6.3 directions.json（完整建议，4 个方向）

```json
[
  {
    "id": "dir6",
    "order": 1,
    "pillar": "internet-infra",
    "icon": "hpc",
    "title": "DNS 与标识解析",
    "en": "DNS & Identifier Resolution",
    "summary": "研究域名系统（DNS）与互联网标识解析的关键技术，支撑互联网基础资源的规划、建设与稳定运行。",
    "lead": "域名系统是互联网的基础命名与寻址设施。本方向研究 DNS 与标识解析的规划建设、性能评估与标准化，为互联网基础资源的稳定运行提供支撑。",
    "content": [
      "本方向面向域名系统（DNS）与互联网标识解析等基础性问题，覆盖域名基础资源的规划建设、解析性能与服务质量评估、中文域名与国际化域名的标准化推广，以及网络标识体系的演进研究。",
      "团队曾负责国家域名全球服务平台规划建设与关键系统研制，推动中文域名标准化及“.中国”国家顶级域名入根，参与创建互联网域名管理技术国家工程实验室，在域名数据监控、解析性能与安全评估等方面积累了长期的研究基础。",
      "该方向以工程成果与标准贡献为主；其延伸的安全与数据问题，由实验室的「网络安全与隐私保护」「数据互操作」方向承接（论文成果见对应方向）。"
    ],
    "keywords": ["域名系统", "DNS", "标识解析", "中文域名", "互联网基础资源"],
    "methods": ["域名数据监控", "解析性能评估", "域名标准化", "标识解析技术"],
    "highlights": [
      { "type": "platform", "title": "国家域名全球服务平台", "desc": "负责规划建设与关键系统研制" },
      { "type": "standard", "title": "中文域名标准化与“.中国”入根", "desc": "推动中文域名标准化及国家顶级域名入根" },
      { "type": "platform", "title": "互联网域名管理技术国家工程实验室", "desc": "参与创建，李晓东研究员曾任主任" }
    ],
    "featuredPapers": []
  },
  {
    "id": "dir7",
    "order": 2,
    "pillar": "internet-infra",
    "icon": "search",
    "title": "网络安全与隐私保护",
    "en": "Cybersecurity & Privacy",
    "summary": "研究 DNS 安全、域名滥用检测与隐私保护的流数据采集技术，保障互联网基础设施的安全可信运行。",
    "lead": "本方向聚焦互联网基础设施的安全问题，研究 DNS 缓存投毒等攻击的防御机制、基于大规模解析数据的域名滥用早期检测，以及隐私保护的流数据采集与处理协议。",
    "content": [
      "DNS 是互联网的关键基础设施，也是网络攻击的高发面。本方向研究 DNS 缓存投毒等攻击的检测与防御机制，以及域名滥用行为的早期识别方法。",
      "代表性工作包括：基于区块链与激励机制的 DNS 可信解析架构（TI-DNS 系列，TrustCom 2023 / Computer Networks 2024）、面向注册阶段域名滥用检测的深度特征交互框架（DeFiAD，TrustCom 2025）、基于本地差分隐私与草图协议的隐私流数据采集协议（PrivSketch / PSF，DEXA 2023 / IEEE IoT Journal 2024）等。"
    ],
    "keywords": ["DNS 安全", "域名滥用检测", "区块链可信解析", "隐私保护", "异常检测"],
    "methods": ["区块链可信解析", "深度特征交互", "域名滥用检测", "本地差分隐私", "草图协议"],
    "highlights": [],
    "featuredPapers": ["ti-dns-trustcom-2023", "dns-backbone-comnet-2024", "defiad-trustcom-2025", "streaming-data-iotj-2024", "privsketch-dexa-2023", "illegal-webpage-bigdata-2022"]
  },
  {
    "id": "dir8",
    "order": 3,
    "pillar": "data-interop",
    "icon": "ml",
    "title": "数据互操作",
    "en": "Data Interoperation",
    "summary": "研究数据与应用解耦背景下的互操作、授权与合规技术，支撑跨主体、跨系统的数据安全共享与可信流通。",
    "lead": "数据互操作是本实验室的核心研究方向，聚焦数据与应用解耦后的互操作、授权与合规问题，为数据要素的合规流通提供技术支撑。",
    "content": [
      "本方向面向数据要素化与数据流通需求，研究数据与应用解耦场景下的去中心化数据互操作方案、可验证身份与策略驱动的跨域授权机制，以及跨境数据传输的合规建模方法。",
      "代表性工作包括：数据自持导向的去中心化互操作架构（DIA，COMPSAC 2023；Dominate Data by Yourself，WWW Journal 2025）、基于 DNS 的授权框架（DiSAuth，Computer Networks 2024）、跨域访问控制体系（FlexAuth / POLARIS，TrustCom 2023 / 2025）、跨境数据合规管理系统（CBCMS，IEEE BigData 2024）与多司法辖区合规策略建模（Information and Software Technology 2026）等。"
    ],
    "keywords": ["数据互操作", "数据授权", "数据所有权", "访问控制", "跨境数据合规"],
    "methods": ["去中心化数据互操作", "可验证身份", "策略授权", "跨境数据合规建模", "数据所有权"],
    "highlights": [],
    "featuredPapers": ["dia-compsac-2023", "dominate-data-wwwj-2025", "disauth-comnet-2024", "flexauth-trustcom-2023", "polaris-trustcom-2025", "cbcms-bigdata-2024", "structured-policy-ist-2026"]
  },
  {
    "id": "dir9",
    "order": 4,
    "pillar": "data-interop",
    "icon": "llm",
    "title": "数据管理与分析",
    "en": "Data Management & Analytics",
    "summary": "研究大规模高维数据与时间序列数据的高性能索引、检索与分析技术。",
    "lead": "本方向研究大规模高维数据与时间序列数据的管理与分析系统，重点关注具有理论保证的近似最近邻（ANN）检索、内存索引与并行化技术，为数据平台建设提供底层支撑。",
    "content": [
      "高维数据检索是推荐系统、数据平台与互操作系统共用的底层技术。本方向研究具有查询质量理论保证的近似最近邻检索方法，以及面向多核 CPU 的并行内存索引技术。",
      "代表性工作包括：基于动态编码树的局部敏感哈希方案（DET-LSH，VLDB 2024；PDET-LSH，IEEE TKDE 2026）、面向高维数据的子空间碰撞检索框架（Subspace Collision，SIGMOD 2025）等，在索引与查询效率上较现有方法取得数量级提升。"
    ],
    "keywords": ["近似最近邻搜索", "局部敏感哈希", "内存索引", "高维数据", "并行计算"],
    "methods": ["近似最近邻搜索", "局部敏感哈希", "动态编码树", "子空间碰撞", "多核并行"],
    "highlights": [],
    "featuredPapers": ["det-lsh-vldb-2024", "pdet-lsh-tkde-2026", "subspace-collision-sigmod-2025"]
  }
]
```

**字段说明**：

| 字段 | 状态 | 说明 |
| --- | --- | --- |
| `order` | ▲ 新增 | 展示顺序（当前文件顺序即 dir6→dir9） |
| `pillar` | ▲ 新增 | 归属主线 id，供 /research 按主线分组 |
| `lead` | ▲ 新增 | 详情页「方向概述」首段 |
| `methods` | ▲ 新增 | 关键技术点标签组 |
| `highlights` | ▲ 新增 | 工程/标准类代表性成果（`type` 枚举：platform/standard/project） |
| `featuredPapers` | ▲ 新增 | 精选论文 id 有序列表；为空则前端按年份聚合全部相关论文 |

### 6.4 papers.json 变更说明（结构不变）

- **删除**：14 篇虚构论文（`open-world-perception-2025` 至 `patent-distill-2022`，含全部虚构作者与 `example` DOI）。
- **保留**：16 篇真实论文，字段与 `research_direction` 映射不变。
- **可选新增**：`"featured": true` 标记首页策展论文（建议 5 篇：`pdet-lsh-tkde-2026`、`structured-policy-ist-2026`、`subspace-collision-sigmod-2025`、`dominate-data-wwwj-2025`、`polaris-trustcom-2025`）。
- **摘要补全**（数据工程师任务，来自 data_sources.md §3.5）：`dominate-data-wwwj-2025`、`structured-policy-ist-2026`、`privsketch-dexa-2023` 三篇暂无摘要，可由出版社/OpenAlex 补录。

### 6.5 方向 ↔ 论文映射总表

| 方向 | 论文 id | 标题（摘要） | venue / 年份 |
| --- | --- | --- | --- |
| dir7 | ti-dns-trustcom-2023 | TI-DNS: A Trusted and Incentive DNS Resolution Architecture Based on Blockchain | TrustCom 2023 |
| dir7 | privsketch-dexa-2023 | PrivSketch: A Private Sketch-Based Frequency Estimation Protocol for Data Streams | DEXA 2023 |
| dir7 | illegal-webpage-bigdata-2022 | Fast Illegal Webpage Detection Algorithm Based on Massive Domain Name Resolution Records | IEEE BigData 2022 |
| dir7 | dns-backbone-comnet-2024 | Securing the Internet's Backbone: A Blockchain-Based and Incentive-Driven Architecture for DNS Cache Poisoning Defense | Computer Networks 2024 |
| dir7 | streaming-data-iotj-2024 | Streaming Data Collection with a Private Sketch-Based Protocol | IEEE IoT Journal 2024 |
| dir7 | defiad-trustcom-2025 | DeFiAD: A Unified Method for Early-Stage Domain Abuse Detection through Automated Deep Feature Interaction | TrustCom 2025 |
| dir7 | polaris-trustcom-2025 | POLARIS: Cross-Domain Access Control via Verifiable Identity and Policy-Based Authorization（与 dir8 双归属，负责人 2026-08-21 调整） | TrustCom 2025 |
| dir8 | dia-compsac-2023 | Data Interoperating Architecture (DIA): Decoupling Data and Applications to Give Back Your Data Ownership | COMPSAC 2023 |
| dir8 | flexauth-trustcom-2023 | FlexAuth: A Decentralized Authorization System with Flexible Delegation | TrustCom 2023 |
| dir8 | disauth-comnet-2024 | DiSAuth: A DNS-based secure authorization framework for protecting data decoupled from applications | Computer Networks 2024 |
| dir8 | cbcms-bigdata-2024 | CBCMS: A Compliance Management System for Cross-Border Data Transfer | IEEE BigData 2024 |
| dir8 | dominate-data-wwwj-2025 | Dominate Data by Yourself: A Decentralized Scheme for Data Interoperation when Data is Decoupled from Applications | WWW Journal 2025 |
| dir8 | polaris-trustcom-2025 | POLARIS: Cross-Domain Access Control via Verifiable Identity and Policy-Based Authorization | TrustCom 2025 |
| dir8 | structured-policy-ist-2026 | Structured Policy Modeling and Context-Aware Generation for Multi-Jurisdictional Compliance in Global Software Systems | Information and Software Technology 2026 |
| dir9 | det-lsh-vldb-2024 | DET-LSH: A Locality-Sensitive Hashing Scheme with Dynamic Encoding Tree for Approximate Nearest Neighbor Search | VLDB 2024 |
| dir9 | pdet-lsh-tkde-2026 | PDET-LSH: Scalable In-Memory Indexing for High-Dimensional Approximate Nearest Neighbor Search with Quality Guarantees | IEEE TKDE 2026 |
| dir9 | subspace-collision-sigmod-2025 | Subspace Collision: An Efficient and Accurate Framework for High-dimensional Approximate Nearest Neighbor Search | SIGMOD 2025 |

---

## 7. 数据清理与迁移步骤（无代码）

> 以下为数据侧操作清单（由数据工程师执行，无需改动页面结构即可完成大部分内容更新）：

1. **清理虚构数据**：`directions.json` 删除 dir1–dir5；`papers.json` 删除 14 篇虚构论文；`news.json` **已清空为 `[]`**（虚构占位全部移除，首页新闻模块显示空态；真实新闻按 §3.5 草稿及实际事件补充）。
2. **替换 site.json 文案**：按 §6.1 整体替换（lab/about/stats/milestones/honors/recruit/contact/friendLinks）。注意：实验室无官方英文名/短名（不设 IFTL，`shortName` 用中文全称兜底）；`milestones` 采用负责人提供的权威沿革（2011/2016/2020 三条）；2020 节点图片放入 `frontend/public/images/milestones/`，并在该条目填 `image`/`imageCaption` 字段。
3. **重命名方向**：按 §6.3 更新 dir6–dir9 的 `title/en/summary/content/keywords`，`id` 与 `research_direction` 关联**保持不变**。
4. **新增数据文件**：新增 `research.json`（§6.2）。
5. **补全论文摘要**：3 篇缺摘要论文（§6.4）。
6. **前端小改（如需双主线展示）**：`/research` 页面导语改为读 `research.json.page.intro`；方向卡按 `pillar` 分组（主线 A/B 两区块）；`DirectionDetail` 增渲染 `lead/methods/highlights`，dir6 显示代表性成果而非「暂无相关论文」；`/about` 增渲染 `positioning` 与 `affiliation`。以上均为可选项，不做也不影响数据加载。
7. **回归校验**：JSON 语法、首页/方向页/论文页渲染、方向-论文-成员交叉链接数量与 §2.3 一致。

---

## 8. 事实溯源与待确认清单

### 8.1 事实溯源表

| 文案事实 | 来源 |
| --- | --- |
| 发展历程沿革（2011-12 开放实验室 → 2016-10 实验室成立 → 2020-07 伏羲智库共建） | 负责人提供（权威沿革）；可对照计算所官网新闻：http://ict.cas.cn/xwgg/jssxw/201811/t20181103_5163554.html |
| 依托网络技术研究中心；中心方向含数据分析、网络安全、区块链、网络标识 | 计算所部门介绍：http://www.ict.ac.cn/jssgk/zzjg/kyxt/wljsyjzx/js/ |
| 李晓东档案（职务、经历、荣誉、国家工程实验室主任） | 计算所人才库：http://www.ict.cas.cn/sourcedb/cn/jssrck/201902/t20190220_5242093.html ；UCAS：https://people.ucas.edu.cn/~0009506 |
| 彭博韬档案（副研究员、研究方向、火花奖） | 计算所人才库：https://ict.cas.cn/sourcedb/cn/jssrck/202504/t20250418_7603883.html ；个人主页：https://botaopeng.github.io/ |
| 伏羲智库与计算所战略合作（2020） | 中国日报网：http://tech.chinadaily.com.cn/a/202009/03/WS5f50aedea3100849784230a8.html（沿革已由负责人权威版本替代，此条保留作背景参考） |
| 「数据互操作」作为研究方向定位 | 人民邮电报（李晓东《数据互操作技术释放数据要素价值》）：https://www.cnii.com.cn/rmydb/202310/t20231013_511752.html |
| 16 篇论文的 venue/年份/DOI/作者 | `papers.json`（Crossref/OpenAlex 已核验，见 data_sources.md §1.3） |
| 教师 2 人、在读研究生 16 人 | `members.json`（2 faculty + 16 students） |

### 8.2 待确认清单

| # | 事项 | 建议处理 |
| --- | --- | --- |
| T1 | ~~实验室官方英文名/短名~~ —— 负责人确认：**无官方英文名与短名，建议不设** | 已解决：不设短名（IFTL 建议撤销）；导航 Logo 显示中文全称；`nameEn` 保留为工作翻译，不对外宣称官方（同步更新 data_sources.md §3.11） |
| T2 | dir6 论文清单（现有 16 篇清单内无直接论文，工程/标准成果已列） | 负责人补充论文或维持现状 |
| T3 | 平台与数据资源（DNS 数据集规模、计算集群配置） | 以实验室实际平台为准 |
| T4 | 实验室公共邮箱、电话、精确地址 | 现 `example` 占位必须替换；地址建议参照计算所信息公开页 https://www.ict.cas.cn/xxgk/xxgklxfs/ |
| T5 | 发展历程：权威沿革（2011/2016/2020 三条）已由负责人提供并替换；**2020 节点签约照片待插入** `frontend/public/images/milestones/2020-cofound-signing.jpg` | 成果类节点（论文产出、获奖）可按需追加，由负责人确认 |
| T6 | 新闻草稿日期与来源（§3.5 三条） | 发布前核对论文录用日期与新闻发布渠道 |
| T7 | 三篇论文摘要补全 | 数据工程师从出版社/OpenAlex 补录 |
| T8 | `news.json` 已清空为 `[]`（虚构占位全部移除） | 首页新闻模块显示空态；真实新闻按 §3.5 草稿及实际事件补充 |

---

*本文档为内容架构建议稿，供 PM/数据工程师/前端评审。任何方向增减、文案调整须保证与论文数据及公开资料一致，并同步更新本文件与 `artifacts/data_sources.md`。*
