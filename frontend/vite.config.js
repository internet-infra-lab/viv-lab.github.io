import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base：站点部署的 URL 子路径。
  // - 本地开发 / 部署到域名根路径（如未来的 viv.cn 二级域名）：不设置 BASE_PATH，默认 "/"；
  // - 部署到 GitHub Pages 项目站点（https://<owner>.github.io/<repo>/）：
  //   CI 工作流中动态注入 BASE_PATH=/<repo>/，代码内不写死任何 github.io 地址。
  // 构建产物中的所有静态资源（assets / public 目录 / favicon / 数据图片）都会带上此前缀。
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
})
