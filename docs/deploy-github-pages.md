# 部署指南：GitHub Pages（viv-lab）

实验室官网（React + Vite 静态站）通过 GitHub Actions 自动构建并发布到 GitHub Pages。
**无需手动上传任何构建产物**，push 代码后自动更新。

---

## 1. 命名约定

- **网站页面品牌**：保持「互联网基础技术实验室 / ICT Lab for Infrastructure」不变（title、导航、页脚），本次不调整页面内容；
- **GitHub 仓库名 / 部署标识 / 域名**：统一使用 **viv-lab**（不使用 `ict-lab` 作为部署标识）。

仓库名建议（二选一，见第 4 节「访问地址」确定最终形态）：

| 方案 | 仓库名 | 部署形态 | 访问地址 |
| --- | --- | --- | --- |
| A（项目站点） | `viv-lab`（或 `viv-lab-website`） | 子路径 | `https://<账号>.github.io/viv-lab/` |
| B（用户/组织站点） | `viv-lab.github.io` | 根路径 | `https://viv-lab.github.io/`（恰为预期地址） |

> 若希望最终地址**恰为 `https://viv-lab.github.io`**：请以 `viv-lab` 作为 GitHub 账号/组织名，并按方案 B 新建仓库
> `viv-lab.github.io`（GitHub 用户/组织站点约定，必须精确命名为 `viv-lab.github.io`）。
>
> 若仓库名为 `viv-lab`（方案 A，即使账号同为 `viv-lab`），地址将是 `https://viv-lab.github.io/viv-lab/`。

CI 工作流会根据仓库名**自动推导部署子路径**（仓库名以 `.github.io` 结尾 → 根路径 `/`；否则 → `/<仓库名>/`），
代码与配置中不写死任何 github.io 地址，两种方案开箱即用。

## 2. 部署步骤

1. 在 GitHub 上创建仓库（按第 1 节约定命名，建议公开或私有均可）。
2. 将本工作区推送为仓库根目录（`frontend/`、`.github/`、`docs/`、`README.md` 等在仓库根下）：
   ```bash
   git init
   git add .
   git commit -m "chore: 初始化 viv-lab 官网"
   git branch -M main
   git remote add origin git@github.com:<账号>/<仓库名>.git
   git push -u origin main
   ```
3. 推送后，GitHub Actions 自动执行 `.github/workflows/deploy.yml`：
   - `frontend/` 内 `npm ci && npm run build`（`BASE_PATH` 按仓库名自动注入）；
   - 产物目录 `frontend/dist` 上传并发布到 Pages。
4. 首次部署完成后，访问第 4 节对应地址即可。
5. 后续每次 `git push`（默认分支）都会自动重新构建并更新线上站点；也可在
   Actions 页面手动触发（`Run workflow`）。

## 3. GitHub 仓库需要开启的设置

> 采用官方推荐的 **GitHub Actions** 发布方式（工作流已包含 `permissions: pages: write` 等配置，无需手工授权）。

| 设置项 | 位置 | 操作 |
| --- | --- | --- |
| Pages 发布源 | Settings → Pages | **Source（发布源）选择 `GitHub Actions`**（不是 Branch） |
| Actions 权限 | Settings → Actions → General → Workflow permissions | 保持默认即可（工作流自带 `pages: write` / `id-token: write`） |
| 默认分支 | Settings → General | 建议为 `main`（工作流监听默认分支推送） |
| 自定义域名 | Settings → Pages → Custom domain | **本次暂不填写**；迁移 viv.cn 时再配置（见第 5 节） |

> 说明：只要仓库开了 Pages 且发布源选 `GitHub Actions`，推送后由工作流自动构建发布；
> 构建产物不需要提交到仓库（`frontend/dist` 已在 `.gitignore` 中），也不会手动上传。

## 4. 最终访问地址格式

| 场景 | 地址 |
| --- | --- |
| 账号 `viv-lab` + 仓库 `viv-lab.github.io`（方案 B） | `https://viv-lab.github.io/` |
| 账号 `viv-lab` + 仓库 `viv-lab`（方案 A） | `https://viv-lab.github.io/viv-lab/` |
| 其他账号 `<owner>` + 仓库 `viv-lab`（方案 A） | `https://<owner>.github.io/viv-lab/` |

深层路由（如 `/news/1`、`/team/xxx`）支持直接刷新访问：工作流会在构建产物中生成
`404.html`（SPA 路由兜底，GitHub Pages 对缺失路径返回该文件），配合应用内
`BrowserRouter basename` 与 `BASE_URL` 前缀，刷新/直达不会 404。

## 5. 后续迁移 viv.cn 二级域名（规划，不在本次范围）

站点按「标准静态网站」方式部署，域名可随时切换，无需改动代码：

1. 在 viv.cn 的 DNS 服务商处为该二级域名添加一条 **CNAME 记录**，指向
   `https://viv-lab.github.io` 对应的主机（或届时按实际托管方式配置）；
2. 在 GitHub 仓库 Settings → Pages → Custom domain 填写该二级域名并保存（可勾选 Enforce HTTPS）；
3. 部署环境变量调整：若届时由 viv.cn 直接托管静态文件（站点位于域名根路径），
   构建时将 `BASE_PATH` 设为 `/`（即不注入该变量，默认即为 `/`）；
   工作流内的动态推导逻辑对根路径部署同样生效，仓库内无任何 github.io 硬编码。

## 6. 涉及的文件清单

| 文件 | 作用 |
| --- | --- |
| `.github/workflows/deploy.yml` | 自动构建 + 发布（含 404.html / .nojekyll / 动态 BASE_PATH） |
| `frontend/vite.config.js` | `base` 由环境变量 `BASE_PATH` 控制（默认 `/`） |
| `frontend/src/main.jsx` | `BrowserRouter basename` 与部署 base 保持一致 |
| `frontend/src/utils/asset.js` | 静态图片路径自动拼接部署 base |
| `frontend/index.html` | favicon 等站点内资源使用 `%BASE_URL%` 前缀 |
| `frontend/public/` | favicon / logo / 图片原样发布 |
