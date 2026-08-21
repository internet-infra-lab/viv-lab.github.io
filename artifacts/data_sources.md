# 实验室官网数据来源记录（Data Sources）

| 项目 | 内容 |
| --- | --- |
| 编写角色 | Data Engineer Agent |
| 编写日期 | 2026-08-21 |
| 数据范围 | `frontend/src/data/members.json`、`papers.json`、`directions.json`、`site.json`（实验室名称/所属单位） |
| 说明 | 论文不做主动检索与 DOI 核验，以人工提供的清单为准；本文件记录每条信息的来源、获取日期与对应字段，并列出需要人工确认的内容 |

---

## 1. 信息来源一览

### 1.1 人员（李晓东、彭博韬）

| # | 来源网站 | URL | 获取日期 | 对应字段 |
| --- | --- | --- | --- | --- |
| A1 | 中国科学院计算技术研究所 · 计算所人才库（李晓东） | https://ict.cas.cn/sourcedb/cn/jssrck/201902/t20190220_5242093.html | 2026-08-21 | 姓名、职称（研究员）、所属部门（网络技术研究中心）、邮箱、简历（含实验室主任、伏羲智库创办人、CNNIC 原主任、ICANN 原副总裁等）、主要论著、获奖荣誉 |
| A2 | 中国科学院大学教师主页（李晓东） | https://people.ucas.edu.cn/~0009506 | 2026-08-21 | 基本信息、研究领域/招生方向、教育背景、工作经历、社会兼职、指导学生 |
| A3 | 中国科学院计算技术研究所 · 计算所人才库（彭博韬） | https://ict.cas.cn/sourcedb/cn/jssrck/202504/t20250418_7603883.html | 2026-08-21 | 姓名、职称（副研究员）、所属部门（网络技术研究中心）、邮箱、个人网页、简历（教育/工作经历）、主要论著、专利、科研项目、获奖荣誉 |
| A4 | 彭博韬个人主页 | https://botaopeng.github.io/ | 2026-08-21 | 研究方向（高维数据与时间序列管理系统、跨域数据交换系统）、论文列表、项目、获奖 |
| A5 | 计算所网络技术研究中心「科研人员」列表页 | http://www.ict.cas.cn/jssgk/zzjg/kyxt/wljsyjzx/ky/ | 2026-08-21 | 所属机构核实：李晓东列入研究员名单、彭博韬列入副研究员名单 |
| A6 | 计算所新闻：CNNIC 与计算所成立互联网基础技术实验室 | http://ict.cas.cn/xwgg/jssxw/201811/t20181103_5163554.html | 2026-08-21 | 实验室全称核实：互联网基础技术实验室（2016 年 CNNIC 与计算所共建，李晓东任主任） |
| A7 | 计算所网络技术研究中心「部门介绍」页 | http://www.ict.ac.cn/jssgk/zzjg/kyxt/wljsyjzx/js/ | 2026-08-21 | 实验室隶属核实：互联网基础技术实验室为网络技术研究中心下设实验室，研究方向含数据分析、网络安全、区块链、网络标识等 |
| A8 | 项目负责人人工确认 | 实验室全称「互联网基础技术实验室」、所属单位「中国科学院计算技术研究所」；清理示例占位成员 | 2026-08-21 | site.json 名称/所属字段、members.json 示例成员清理 |

### 1.2 实验室成员（16 名学生）

| # | 来源 | 说明 | 获取日期 |
| --- | --- | --- | --- |
| B1 | 项目负责人人工提供（聊天输入） | 成员姓名、入学年级、身份（直博生/硕士生/硕转博），按年级从大到小排列 | 2026-08-21 |

### 1.3 论文清单

| # | 来源 | 说明 | 获取日期 |
| --- | --- | --- | --- |
| C1 | 项目负责人人工提供（聊天输入） | 17 条论文标题（含 1 条重复：DIA 出现两次），未按时间排序 | 2026-08-21 |
| C2 | Crossref API（范围收缩前已核验，仅用于清单内已收录论文） | 10 篇论文的期刊/会议名、年份、DOI、作者名单核验 | 2026-08-21 |
| C3 | OpenAlex API（同上） | 7 篇论文的官方摘要（出版社存缴的真实摘要） | 2026-08-21 |
| C4 | 项目负责人人工提供（聊天输入，JSON 格式） | 6 篇论文的完整元数据（venue/年份/类型/作者/DOI/关键词/摘要）：DIA、CBCMS、DiSAuth、FlexAuth、POLARIS、Fast Illegal Webpage | 2026-08-21 |
| C5 | 项目负责人人工确认 | 全部论文通讯作者为李晓东（论文中署名为 Xiaodong Lee 或 Xiaodong Li） | 2026-08-21 |

### 1.4 研究方向

| # | 来源 | 说明 | 获取日期 |
| --- | --- | --- | --- |
| D1 | 来源 A1/A2（李晓东公开研究领域）、A3/A4（彭博韬公开研究兴趣与论文主题） | 归纳为 4 个研究方向（dir6–dir9） | 2026-08-21 |

---

## 2. 数据文件与字段映射

### members.json（共 18 条 = 2 教师 + 16 学生）

- 教师（role=`faculty`，前端团队页暂未设「教师」页签，详见 §3.7）：
  - `li-xiaodong`：李晓东，研究员，博士生导师，互联网基础技术实验室主任（来源 A1/A2）
  - `peng-botao`：彭博韬，副研究员（来源 A3/A4）
  - `affiliation` 均更新为「中国科学院计算技术研究所 · 互联网基础技术实验室」（来源 A8）
- 学生（role=`phd`/`master`，字段来自 B1）：
  - `grade` 采用「20XX级直博生/硕士生」格式；庄智显为「2022级硕士生（2025年硕转博）」，按当前在读身份归入 `phd`
  - 有论文署名的 6 人（李颖/魏久麒/符玉梵/张爱瑶/庄智显/代兆君）`researchArea` 依据其论文主题归纳（来源 C2）；苏越/张有宜/费子郁 亦有论文产出（见 §3.3），研究方向暂留空由负责人自行调整；其余学生 `researchArea` 留空待确认
- 示例占位成员：**已全部清理**（原 17 条「示例大学」虚构成员，来源 A8）

### papers.json（共 30 条 = 16 篇真实论文 + 14 篇示例占位）

- 真实论文按年份倒序排列（与站点默认排序一致）：10 篇完成 Crossref 核验（来源 C2），6 篇采用人工提供的元数据（来源 C4，6 个 DOI 均已通过 doi.org 解析验证）
- 摘要：7 篇为出版社存缴真实摘要（来源 C3），6 篇为人工提供（来源 C4），3 篇暂无（dominate-data-wwwj-2025、structured-policy-ist-2026、privsketch-dexa-2023，待负责人补充）
- 通讯作者：16 篇真实论文的通讯作者均为李晓东（来源 C5），按各论文署名（Xiaodong Lee / Xiaodong Li）标记 `corresponding: true`
- 类型映射：人工提供的 "Conference Paper" → `会议`、"Journal Article" → `期刊`
- 会议 venue 统一为「简称 + 年份」格式（如 IEEE COMPSAC → `COMPSAC 2023`、IEEE Big Data → `IEEE BigData 2024`），期刊 venue 用官方刊名
- 关键词：6 篇新论文保留人工提供的英文关键词，其余论文为中文关键词（搜索功能两者均可命中）
- 示例占位：原 14 条虚构论文原样保留，待替换

### directions.json（共 9 条 = 4 真实方向 + 5 示例占位）

- 真实方向（dir6–dir9）依据 D1 归纳，内容仅包含可溯源的事实描述
- 示例方向（dir1–dir5）原样保留为占位
- 图标复用现有图标集（hpc/search/ml/llm），非专属图标，如需定制请 UI 侧处理

### site.json（本次仅更新实验室名称与所属单位）

- `lab.nameZh` = 互联网基础技术实验室（来源 A8，与 A6 官方新闻一致）
- `lab.nameEn` = Internet Fundamental Technology Laboratory（**翻译，官方英文名未公开，待确认**，见 §3.11）
- `lab.shortName` = IFTL（**建议值，待确认**）
- `lab.university` = 中国科学院计算技术研究所（来源 A8）
- 其余字段（tagline/heroSubtitle/about/stats/milestones/honors/recruit/contact/friendLinks）仍为示例内容，**待真实数据替换**（见 §3.12）

---

## 3. 需要人工确认 / 冲突信息

| # | 内容 | 状态 | 建议处理 |
| --- | --- | --- | --- |
| 3.1 | **论文清单重复**：原人工清单中「DIA」出现两次；人工补充元数据中仅出现一次 | 已按 1 篇入库（`dia-compsac-2023`） | 已解决 |
| 3.2 | **6 篇论文元数据**：DIA、CBCMS、DiSAuth、FlexAuth、POLARIS、Fast Illegal Webpage | 已入库（来源 C4） | 已解决；方向映射：DIA/CBCMS/DiSAuth/FlexAuth→dir8，Fast Illegal Webpage→dir7；**POLARIS 于 2026-08-21 增加 dir7 标签（负责人要求，归属「数据安全、身份认证与跨域授权」方向，与 dir8 双归属）；张爱瑶（POLARIS 一作）同步增加 dir7 方向标签** |
| 3.3 | 学生 `researchArea`/`bio`/`email`/`education` 大部分为空 | 待确认 | 负责人自行在数据端调整；另：新增论文署名显示苏越（Yue Su，Fast Illegal Webpage 一作）、张有宜（Youyi Zhang，DIA）、费子郁（Ziyu Fei，DiSAuth/FlexAuth）有论文产出，如需可据此补研究方向。**2026-08-22 已补全**：苏越 → dir7（域名滥用检测与网络安全）；张有宜、费子郁 → dir8（数据互操作与数据架构 / 数据授权与访问控制） |
| 3.4 | 论文通讯作者 | 已确认全部为李晓东（来源 C5），已在 16 篇真实论文中标记 | 已解决；注意署名变体：多数论文为 Xiaodong Lee，TI-DNS/DIA/FlexAuth/Fast Illegal Webpage 为 Xiaodong Li |
| 3.5 | 摘要：dominate-data-wwwj-2025、structured-policy-ist-2026、privsketch-dexa-2023 共 3 篇暂无摘要 | 待负责人补充 | 请在 `frontend/src/data/papers.json` 对应条目中新增 `"abstract": "..."` 字段（见交付说明 §3.5 定位） |
| 3.6 | 李晓东教育经历：官方页面硕士（1998–2001，网络中心）与博士（2000–2004，计算所）时间重叠 | 按官方原文呈现 | 负责人已确认暂不改动 |
| 3.7 | 前端团队页页签（博士后/博士生/硕士生/科研助理/校友）不含「教师」，`role=faculty` 的 2 位教师当前不会显示在团队页 | 数据已就绪 | 需前端补充教师页签（属于前端任务，不在数据工程范围） |
| 3.8 | 李晓东英文署名：论文中多署名为 Xiaodong Lee（个别论文为 Xiaodong Li，如 TI-DNS） | 按各论文原文署名 | 检索/展示时注意重名 |
| 3.9 | 期刊名缩写差异：World Wide Web（Springer）在部分来源写作「WWW Journal」；Computer Networks 写作「Computer Network」 | 已统一为期刊官方名 | 无需处理 |
| 3.10 | 示例占位数据 | **已清理（2026-08-21 内容架构同步）**：directions.json 删除 dir1–dir5（仅存 dir6–dir9 四个真实方向）；papers.json 删除全部 14 篇虚构论文（仅存 16 篇真实论文）；news.json 清空为 `[]`；site.json 全部占位文案已替换。见 `artifacts/research_content_architecture.md` |
| 3.11 | 实验室英文名：官方未公开，暂用翻译「Internet Fundamental Technology Laboratory」，短名建议「IFTL」 | **已确认（负责人）**：无官方英文名与短名，不设短名（IFTL 撤销）；`shortName` 用中文全称兜底，`nameEn` 保留为工作翻译不对外宣称官方 |
| 3.12 | site.json 其余字段仍为「示例大学」占位（含首页标语、实验室介绍、统计数字、里程碑、荣誉、联系方式、友情链接） | **已替换（2026-08-21）**：lab/stats/about/positioning/milestones/affiliation/honors/recruit/contact/friendLinks 均按内容架构方案更新；联系方式（公共邮箱/电话/精确地址）、平台资源仍待确认（见 §3.13 与架构方案 §8.2） |
| 3.13 | 待确认事项（延续） | 实验室公共邮箱/电话/精确地址（现为「待确认」占位）；dir6 论文清单（现无直接论文）；平台与数据资源；2020 签约照片已放入 `frontend/public/images/milestones/2020-cofound-signing.jpg` | 见 `artifacts/research_content_architecture.md` §8.2 清单 |

---

## 4. 质量检查结论（2026-08-21）

- [x] JSON 语法：4 个文件均通过 `json.load` 校验
- [x] 字段兼容：`members.json` 每条均含 `research_direction` 数组（前端 `MemberDetail` 依赖该字段），`papers.json`/`directions.json`/`site.json` 字段与 React 读取方式一致
- [x] 事实核验：10 篇论文的 venue/年份/DOI/作者与 Crossref 记录一致；6 篇人工补充论文的 DOI 均通过 doi.org 解析验证（302）；摘要取自出版社存缴数据或人工提供
- [x] 通讯作者：16 篇真实论文通讯作者均为李晓东（人工确认），前端以 `*` 标注
- [x] 重复/冲突：清单重复已解决（DIA 按 1 篇入库）；重名（Xiaodong Lee/Li）已按论文原文记录
- [x] 清理：17 条示例占位成员已移除；实验室名称/所属单位已更新（英文名待确认）
- [x] 前端回归：`npm run build` 通过（见交付报告）
