import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import assetUrl from '../utils/asset'
import site from '../data/site.json'
import { NAV_ITEMS } from '../config/nav'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  // 新 Logo 图片：加载失败（文件未放置）时回退为文字标 ICP
  const [logoOk, setLogoOk] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 路由变化时关闭抽屉
  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const submitSearch = (e) => {
    e.preventDefault()
    const q = keyword.trim()
    navigate(q ? `/publications?q=${encodeURIComponent(q)}` : '/publications')
    setSearchOpen(false)
    setKeyword('')
  }

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={`${styles.inner} container`}>
        <Link to="/" className={styles.logo} aria-label="返回首页">
          {logoOk ? (
            <img
              src={assetUrl('/logo.jpg')}
              alt={site.lab.shortName}
              className={styles.logoImg}
              onError={() => setLogoOk(false)}
            />
          ) : (
            <span className={styles.logoMark}>ICP</span>
          )}
          <span className={styles.logoText}>
            <span className={styles.logoName}>{site.lab.shortName}</span>
            <span className={styles.logoEn}>{site.lab.nameEn}</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass} end={item.path === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.langSwitch} aria-hidden="true">
            <span className={`${styles.langItem} ${styles.langActive}`}>中</span>
            <span className={styles.langDivider}>/</span>
            <span className={styles.langItem}>EN</span>
          </span>

          <div className={styles.searchWrap}>
            {searchOpen && (
              <form className={styles.searchForm} onSubmit={submitSearch}>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder="搜索论文标题 / 关键词…"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  autoFocus
                  aria-label="站内搜索"
                />
                <button type="submit" className={styles.searchSubmit} aria-label="提交搜索">
                  <Icon name="search" size={18} />
                </button>
              </form>
            )}
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="打开搜索"
            >
              <Icon name="search" size={20} />
            </button>
          </div>

          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.drawer} aria-label="移动端导航">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
              end={item.path === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
