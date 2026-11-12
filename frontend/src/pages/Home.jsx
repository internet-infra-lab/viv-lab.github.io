import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import Section from '../components/Section'
import PublicationCard from '../components/PublicationCard'
import NewsCard from '../components/NewsCard'
import assetUrl from '../utils/asset'
import site from '../data/site.json'
import papers from '../data/papers.json'
import news from '../data/news.json'
import { RESEARCH_DIRECTIONS } from '../config/researchDirections'
import styles from './Home.module.css'

/**
 * 首页定位文案（表现层覆盖）
 * 注：site.json 中 lab.tagline / lab.heroSubtitle 已同步真实定位
 * （「互联网基础技术 · 数据互操作」），此处仍以 HERO 覆盖为
 * 「面向智能互联网的数据互操作基础设施」，两套口径待负责人统一。
 */
const HERO = {
  tagline: '面向智能互联网的数据互操作基础设施',
  subtitle:
    '聚焦数据互操作、互联网基础技术与数据安全可信治理，构建安全、可信、高效的数据流通基础设施，支撑智能互联网时代的跨域数据共享与可信流转。',
}

/** 首页代表成果策展顺序（置顶为核心代表作「Dominate Data by Yourself」） */
const HOMEPAGE_PAPERS = [
  'dominate-data-wwwj-2025',
  'dalq-ecmlpkdd-2026',
  'fedatmv-tmc-2026',
]

/** 平台实践（实验室自研数据互操作平台展示） */
const PLATFORM = {
  title: '数聚平台 VIV',
  desc: '实验室自主研发的数据互操作基础平台，面向智能互联网场景提供可信的数据发现、连接与流通能力，支撑跨组织、跨域的数据协作与应用创新。',
  url: 'https://viv.cn',
}

export default function Home() {
  const latestPapers = HOMEPAGE_PAPERS.map((id) =>
    papers.find((p) => p.id === id),
  ).filter(Boolean)
  const latestNews = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4)
  const featuredDirections = RESEARCH_DIRECTIONS.slice(0, 3)

  return (
    <>
      {/* ---- Hero 区 ---- */}
      <section className={styles.hero}>
        <div className={styles.heroDecor} aria-hidden="true">
          <div className={styles.heroGrid} />
          <div className={styles.heroGlow} />
          {/* 数据互操作科研拓扑装饰（纯 SVG：中心枢纽 + 卫星节点 + 数据流动画） */}
          <svg
            className={styles.heroNetwork}
            viewBox="0 0 640 480"
            fill="none"
            aria-hidden="true"
          >
            {/* 卫星连接线 */}
            <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.2">
              <path d="M320 240 L140 104" />
              <path d="M320 240 L500 96" />
              <path d="M320 240 L556 252" />
              <path d="M320 240 L420 396" />
              <path d="M320 240 L180 392" />
              <path d="M320 240 L96 258" />
            </g>
            {/* 卫星间次链路 */}
            <g stroke="rgba(255,255,255,0.09)" strokeWidth="1">
              <path d="M140 104 L96 258" />
              <path d="M500 96 L556 252" />
              <path d="M420 396 L556 252" />
              <path d="M180 392 L96 258" />
            </g>
            {/* 数据流主链路（流动动画） */}
            <path className={styles.flowPath} d="M320 240 L500 96" />
            <path className={styles.flowPathRev} d="M320 240 L180 392" />
            {/* 中心枢纽：数据互操作 */}
            <g>
              <circle className={styles.hubRing} cx="320" cy="240" r="32" />
              <circle className={styles.hubPulse} cx="320" cy="240" r="30" />
              <circle cx="320" cy="240" r="17" fill="rgba(127,178,229,0.30)" />
              <circle cx="320" cy="240" r="7.5" fill="#ffffff" />
              <text
                x="320"
                y="292"
                textAnchor="middle"
                fill="rgba(255,255,255,0.92)"
                fontSize="13.5"
                fontWeight="600"
                fontFamily="inherit"
              >
                数据互操作
              </text>
            </g>
            {/* 卫星节点 */}
            <g fill="rgba(255,255,255,0.82)">
              <circle cx="140" cy="104" r="5" />
              <circle cx="500" cy="96" r="5" />
              <circle cx="556" cy="252" r="5" />
              <circle cx="420" cy="396" r="5" />
              <circle cx="180" cy="392" r="5" />
              <circle cx="96" cy="258" r="5" />
            </g>
            {/* 卫星标签 */}
            <g fill="rgba(255,255,255,0.66)" fontSize="11.5" fontFamily="inherit">
              <text x="140" y="84" textAnchor="middle">
                DNS · 标识解析
              </text>
              <text x="500" y="78" textAnchor="middle">
                授权 · 认证
              </text>
              <text x="570" y="246" textAnchor="start">
                数据安全
              </text>
              <text x="420" y="420" textAnchor="middle">
                治理 · 合规
              </text>
              <text x="166" y="416" textAnchor="end">
                智能计算
              </text>
              <text x="80" y="254" textAnchor="end">
                互操作协议
              </text>
            </g>
          </svg>
          <span className={`${styles.particle} ${styles.particle1}`} />
          <span className={`${styles.particle} ${styles.particle2}`} />
          <span className={`${styles.particle} ${styles.particle3}`} />
        </div>

        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroContent}>
            <p className={styles.heroOverline}>
              <span className={styles.heroOverlineBar} />
              {site.lab.university}
            </p>
            <h1 className={styles.heroTitle}>{HERO.tagline}</h1>
            <p className={styles.heroSub}>{HERO.subtitle}</p>
            <div className={styles.heroCtas}>
              <Link to="/research" className={styles.btnPrimary}>
                了解研究方向
                <Icon name="arrowRight" size={18} />
              </Link>
              <Link to="/join-us" className={styles.btnGhost}>
                加入我们
              </Link>
            </div>
            <ul className={styles.heroChips} aria-label="重点研究方向快捷入口">
              {featuredDirections.map((d) => (
                <li key={d.id}>
                  <Link to={`/research/${d.id}`} className={styles.heroChip}>
                    <Icon name={d.icon} size={15} />
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.scrollCue} aria-hidden="true">
          <span className={styles.scrollDot} />
        </div>
      </section>

      {/* ---- 01 研究方向（正式展开研究主线） ---- */}
      <section className={styles.sectionBlock}>
        <Section
          title="研究方向"
          en="Research Directions"
          index="01"
          subtitle="围绕「面向智能互联网的数据互操作基础设施」构建的四个核心方向"
          actionLabel="查看全部"
          actionTo="/research"
        >
          <div className={styles.directionGrid}>
            {RESEARCH_DIRECTIONS.map((d, i) => (
              <Link key={d.id} to={`/research/${d.id}`} className={styles.directionCard}>
                <span className={styles.directionIndex} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.directionIcon}>
                  <Icon name={d.icon} size={24} />
                </span>
                <h3 className={styles.directionTitle}>{d.title}</h3>
                <p className={styles.directionSummary}>{d.summary}</p>
                <span className={styles.directionMore}>
                  了解详情
                  <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </Section>
      </section>

      {/* ---- 最新成果 + 新闻动态（featured 论文 + 头条新闻，增强层次） ---- */}
      <section className={styles.sectionBlock}>
        <div className={styles.split}>
          <div className={styles.splitMain}>
            <Section
              title="最新成果"
              en="Recent Publications"
              index="02"
              actionLabel="查看全部论文"
              actionTo="/publications"
            >
              {latestPapers[0] && (
                <div className={styles.paperFeatured}>
                  <Link
                    to={`/publications/${latestPapers[0].id}`}
                    className={styles.paperFeaturedMain}
                  >
                    <div className={styles.paperFeaturedMeta}>
                      <span className={styles.paperFeaturedBadge}>代表成果</span>
                      <span className={styles.paperFeaturedYear}>{latestPapers[0].year}</span>
                      <span className={styles.paperFeaturedVenue}>{latestPapers[0].venue}</span>
                    </div>
                    <h3 className={styles.paperFeaturedTitle}>{latestPapers[0].title}</h3>
                    <p className={styles.paperFeaturedAuthors}>
                      {latestPapers[0].authors
                        .map((a) => (a.corresponding ? `${a.name}*` : a.name))
                        .join(', ')}
                    </p>
                  </Link>
                  {latestPapers[0].doi && (
                    <a
                      className={styles.paperFeaturedDoi}
                      href={latestPapers[0].doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="查看原文"
                      title="查看原文"
                    >
                      <Icon name="external" size={16} />
                    </a>
                  )}
                </div>
              )}
              <div className={styles.paperList}>
                {latestPapers.slice(1).map((p) => (
                  <PublicationCard key={p.id} paper={p} />
                ))}
              </div>
            </Section>
          </div>

          <div className={styles.splitSide}>
            <Section
              title="新闻动态"
              en="News"
              index="03"
              actionLabel="查看全部动态"
              actionTo="/news"
            >
              {latestNews.length > 0 ? (
                <div className={styles.newsPanel}>
                  {latestNews[0] && (
                    <Link to={`/news/${latestNews[0].id}`} className={styles.newsHeadline}>
                      <span className={styles.newsHeadlineMeta}>
                        {latestNews[0].date} · {latestNews[0].category}
                      </span>
                      <h3 className={styles.newsHeadlineTitle}>{latestNews[0].title}</h3>
                      <p className={styles.newsHeadlineSummary}>{latestNews[0].summary}</p>
                      <span className={styles.newsHeadlineMore}>
                        阅读全文
                        <Icon name="arrowRight" size={14} />
                      </span>
                    </Link>
                  )}
                  <div className={styles.newsList}>
                    {latestNews.slice(1).map((n) => (
                      <NewsCard key={n.id} item={n} compact />
                    ))}
                  </div>
                </div>
              ) : (
                <p className={styles.newsEmpty}>新闻动态整理中，敬请期待</p>
              )}
            </Section>
          </div>
        </div>
      </section>

      {/* ---- 04 平台实践（平台展示卡片：左侧介绍 + 右侧浏览器窗口截图预览） ---- */}
      <section className={styles.sectionBlock}>
        <Section title="平台实践" en="Platform Practice" index="04">
          <div className={styles.platformCard}>
            {/* 左侧：平台介绍 */}
            <div className={styles.platformInfo}>
              <p className={styles.platformOverline}>
                <span className={styles.platformOverlineBar} />
                科研成果 · 工程化实践
              </p>
              <h3 className={styles.platformTitle}>{PLATFORM.title}</h3>
              <p className={styles.platformDesc}>{PLATFORM.desc}</p>
              <a
                href={PLATFORM.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformBtn}
              >
                访问平台
                <Icon name="external" size={15} />
              </a>
            </div>

            {/* 右侧：浏览器窗口模拟，展示 viv.cn 首页截图 */}
            <a
              href={PLATFORM.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.platformShot}
              aria-label={`${PLATFORM.title} 界面预览，访问 ${PLATFORM.url}`}
            >
              <span className={styles.shotBar}>
                <span className={styles.shotDots} aria-hidden="true">
                  <i className={styles.shotDot} />
                  <i className={styles.shotDot} />
                  <i className={styles.shotDot} />
                </span>
                <span className={styles.shotUrl}>{PLATFORM.url}</span>
              </span>
              <span className={styles.shotBody}>
                <span className={styles.shotFallback} aria-hidden="true">
                  平台界面截图
                </span>
                <img
                  className={styles.shotImg}
                  src={assetUrl('/images/screenshot.png')}
                  alt={`${PLATFORM.title} 首页截图`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </span>
            </a>
          </div>
        </Section>
      </section>
    </>
  )
}
