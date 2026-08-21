import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

// 与 Vite base 保持一致：部署在子路径（如 GitHub Pages 的 /<repo>/）时，
// BrowserRouter 需要 basename 才能正确解析路由并支持刷新直达（配合 404.html 兜底）。
// 本地开发 / 根路径部署时 BASE_URL 为 "/"，basename 为空字符串，行为不变。
const basename = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
