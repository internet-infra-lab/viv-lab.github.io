# viv-lab · 互联网基础技术实验室官网

互联网基础技术实验室（ICT Lab for Infrastructure）官方展示网站。面向实验室研究方向、团队成员、学术论文与新闻动态的静态展示站点。

> 命名约定：
> - **网站页面品牌**：保持「互联网基础技术实验室 / ICT Lab for Infrastructure」不变（title、导航、页脚）；
> - **GitHub 仓库 / 部署标识 / 域名**：使用 **viv-lab**（仓库名建议 `viv-lab` 或 `viv-lab-website`，未来 viv.cn 域名同样以 viv-lab 命名），不使用 `ict-lab` 作为部署标识。

## 技术栈

| 项目 | 说明 |
| --- | --- |
| 框架 | React 18（函数组件 + Hooks） |
| 构建 | Vite 5 |
| 路由 | react-router-dom 6（BrowserRouter，SPA） |
| 样式 | CSS Modules + 全局样式（src/styles/global.css） |
| 数据 | 本地 JSON（src/data/*.json） |

## 目录结构

```
frontend/                 # 前端应用（独立 npm 工程）
  public/                 # 静态资源：favicon / logo / images（构建时原样拷贝）
  src/
    components/           # 通用组件
    pages/                # 路由页面
    data/                 # 站点内容数据（JSON）
    utils/asset.js        # 静态资源路径解析（自动拼接部署 base）
  index.html
  vite.config.js
.github/workflows/deploy.yml   # GitHub Pages 自动构建部署
docs/deploy-github-pages.md    # 部署文档
```

## 本地开发

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## 构建

```bash
cd frontend
npm run build      # 产物输出到 frontend/dist
```

> 构建时的部署子路径通过环境变量 `BASE_PATH` 注入（默认 `/`，即本地开发与根路径部署）。
> 部署到 GitHub Pages 时由 CI 工作流根据仓库名自动推导，代码内不写死任何 github.io 地址。

## 部署

一键自动部署到 GitHub Pages，详见 [docs/deploy-github-pages.md](docs/deploy-github-pages.md)：
push 代码后由 GitHub Actions 自动构建并发布，无需手动上传构建产物；后续迁移到 viv.cn 二级域名时仅需调整部署环境变量。
