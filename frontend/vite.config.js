import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // base：站点部署的 URL 子路径。
  // - 站点已绑定自定义域名 https://internet-infra-lab.viv.cn/，在域名**根路径**提供服务，
  //   CI 工作流注入 BASE_PATH=/，因此线上资源路径形如 /assets/index-xxx.js；
  // - 本地开发不注入 BASE_PATH，默认同样是 "/"；
  // - 只有取消自定义域名、退回 GitHub Pages 项目站点子路径
  //   （https://<owner>.github.io/<repo>/）时，才需要注入 BASE_PATH=/<repo>/。
  // 构建产物中的所有静态资源（assets / public 目录 / favicon / 数据图片）都会带上此前缀。
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
})
