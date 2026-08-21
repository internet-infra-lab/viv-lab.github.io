/**
 * 站点静态资源路径解析工具
 *
 * 背景：数据文件（members.json / news.json / site.json）与组件中的站点内资源
 * 统一使用以 "/" 开头的站点根相对写法（如 /images/xxx.jpg）。
 * 部署到子路径（例如 GitHub Pages 项目站点 https://<owner>.github.io/<repo>/）
 * 时，浏览器会把 "/images/xxx.jpg" 解析到域名根目录而 404，
 * 因此渲染时需通过本工具拼接 Vite 的 BASE_URL（即部署 base）。
 *
 * 用法：assetUrl('/images/lixiaodong.webp')
 *  - BASE_URL 为 "/"（本地开发 / 域名根路径部署，如未来的 viv.cn）时原样返回；
 *  - BASE_URL 为 "/repo/"（GitHub Pages 子路径）时返回 "/repo/images/xxx.webp"；
 *  - 外部完整 URL（http/https/data/blob 等）原样透传。
 */
export default function assetUrl(path) {
  if (!path) return path
  // 外部链接 / 内联数据 / blob 原样返回
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  const base = import.meta.env.BASE_URL || '/'
  return `${base}${path.replace(/^\//, '')}`
}
