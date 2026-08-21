import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ScrollToTop from './components/ScrollToTop'

import Home from './pages/Home'
import About from './pages/About'
import Team from './pages/Team'
import Research from './pages/Research'
import Publications from './pages/Publications'
import News from './pages/News'
import FacultyDetail from './pages/FacultyDetail'
import MemberDetail from './pages/MemberDetail'
import DirectionDetail from './pages/DirectionDetail'
import PublicationDetail from './pages/PublicationDetail'
import NewsDetail from './pages/NewsDetail'
import JoinUs from './pages/JoinUs'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* 导师详情：由团队成员页卡片链入（导师介绍栏目已并入团队成员页） */}
          <Route path="/faculty" element={<Navigate to="/team" replace />} />
          <Route path="/faculty/:id" element={<FacultyDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<MemberDetail />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/:id" element={<DirectionDetail />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/publications/:id" element={<PublicationDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          {/* 信息架构调整：科研项目并入「研究方向与科研项目」（/research），旧入口重定向 */}
          <Route path="/projects" element={<Navigate to="/research" replace />} />
          <Route path="/join-us" element={<JoinUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
    </>
  )
}
