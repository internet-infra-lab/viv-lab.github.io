import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import assetUrl from '../utils/asset'
import news from '../data/news.json'
import NotFound from './NotFound'
import styles from './detail.module.css'

/** 富文本块渲染：支持 段落 / 标题 / 列表 / 图片 / 引用 */
function renderBlock(block, idx) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 key={idx} className={styles.blockHeading2}>
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 key={idx} className={styles.blockHeading3}>
          {block.text}
        </h3>
      )
    case 'ul':
      return (
        <ul key={idx} className={styles.blockList}>
          {block.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={idx} className={styles.blockList}>
          {block.items.map((li, i) => (
            <li key={i}>{li}</li>
          ))}
        </ol>
      )
    case 'img':
      return (
        <figure key={idx} className={styles.blockFigure}>
          <img src={assetUrl(block.src)} alt={block.alt || ''} className={styles.blockImg} loading="lazy" />
          {block.caption && <figcaption className={styles.blockCaption}>{block.caption}</figcaption>}
        </figure>
      )
    case 'quote':
      return (
        <blockquote key={idx} className={styles.blockQuote}>
          {block.text}
        </blockquote>
      )
    case 'p':
    default:
      return (
        <p key={idx} className={styles.blockParagraph}>
          {block.text}
        </p>
      )
  }
}

export default function NewsDetail() {
  const { id } = useParams()
  const index = news.findIndex((n) => n.id === id)
  const item = news[index]

  const [copied, setCopied] = useState(false)

  if (!item) return <NotFound />

  const prev = news[index - 1]
  const next = news[index + 1]

  const copyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* 降级忽略 */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container section-pad">
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/">首页</Link>
        <span aria-hidden="true">›</span>
        <Link to="/news">新闻动态</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">新闻详情</span>
      </nav>

      <article className={styles.newsArticle}>
        <header className={styles.newsHead}>
          <div className={styles.metaRow}>
            <Tag variant="primary">{item.category}</Tag>
            <span className={styles.newsDate}>{item.date}</span>
            {item.source && <span className={styles.newsSource}>来源：{item.source}</span>}
          </div>
          <h1 className={styles.newsTitle}>{item.title}</h1>
          {item.cover && (
            <div className={styles.newsCover}>
              <img src={assetUrl(item.cover)} alt={item.title} className={styles.newsCoverImg} />
            </div>
          )}
        </header>

        <div className="prose">
          {item.content.map((block, i) => renderBlock(block, i))}
        </div>

        <div className={styles.newsActions}>
          {item.sourceUrl && (
            <a
              className={styles.sourceBtn}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="external" size={16} />
              阅读原文
            </a>
          )}
          <button type="button" className={styles.copyBtn} onClick={copyLink}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            {copied ? '链接已复制' : '复制链接'}
          </button>
        </div>

        <nav className={styles.prevNext} aria-label="上一篇下一篇">
          {prev ? (
            <Link to={`/news/${prev.id}`} className={styles.pnItem}>
              <span className={styles.pnLabel}>上一篇</span>
              <span className={styles.pnTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/news/${next.id}`} className={`${styles.pnItem} ${styles.pnNext}`}>
              <span className={styles.pnLabel}>下一篇</span>
              <span className={styles.pnTitle}>{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </div>
  )
}
