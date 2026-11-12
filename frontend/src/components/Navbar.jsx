import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import assetUrl from '../utils/asset'
import site from '../data/site.json'
import { NAV_ITEMS } from '../config/nav'
import { useLang } from '../i18n/LangContext'
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
  const searchWrapRef = useRef(null)
  const { lang, setLang, t } = useLang()

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

  // 顶部搜索框走全站搜索（论文 / 新闻 / 成员 / 研究方向）
  const submitSearch = (e) => {
    e.preventDefault()
    const q = keyword.trim()
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
    setSearchOpen(false)
    setKeyword('')
  }

  // 搜索面板向下弹出后覆盖页面内容：点击外部或按 Esc 收起
  useEffect(() => {
    if (!searchOpen) return undefined
    const onPointerDown = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false)
      }
    }
    const onEsc = (e) => {
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onEsc)
    }
  }, [searchOpen])

  // Ctrl/Cmd + K 唤起搜索
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const linkClass = ({ isActive }) =>
    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className={`${styles.inner} container`}>
        <Link to="/" className={styles.logo} aria-label={t('brand.aria.home')}>
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
            <span className={styles.logoName}>
              {lang === 'en' ? site.lab.nameEn : site.lab.shortName}
            </span>
            <span className={styles.logoEn}>
              {lang === 'en' ? site.lab.nameZh : site.lab.nameEn}
            </span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label={t('nav.main')}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass} end={item.path === '/'}>
              {item.labelKey ? t(item.labelKey) : item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.langSwitch}>
            <button
              type="button"
              className={`${styles.langItem} ${lang === 'zh' ? styles.langActive : ''}`}
              onClick={() => setLang('zh')}
              aria-pressed={lang === 'zh'}
              lang="zh-CN"
            >
              中
            </button>
            <span className={styles.langDivider}>/</span>
            <button
              type="button"
              className={`${styles.langItem} ${lang === 'en' ? styles.langActive : ''}`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              lang="en"
            >
              EN
            </button>
          </span>

          <div className={styles.searchWrap} ref={searchWrapRef}>
            {searchOpen && (
              <form className={styles.searchForm} onSubmit={submitSearch}>
                <input
                  className={styles.searchInput}
                  type="search"
                  placeholder={t('search.placeholderShort')}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  autoFocus
                  aria-label={t('search.aria')}
                  title={t('search.shortcut')}
                />
                <button type="submit" className={styles.searchSubmit} aria-label={t('search.submit')}>
                  <Icon name="search" size={18} />
                </button>
              </form>
            )}
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={t('search.open')}
            >
              <Icon name="search" size={20} />
            </button>
          </div>

          <button
            className={`${styles.iconBtn} ${styles.menuBtn}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.drawer} aria-label={t('nav.drawer')}>
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
