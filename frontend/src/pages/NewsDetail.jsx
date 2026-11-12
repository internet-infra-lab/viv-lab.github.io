import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import assetUrl from '../utils/asset'
import news from '../data/news.json'
import { useT } from '../i18n/LangContext'
import NotFound from './NotFound'
import styles from './detail.module.css'

/**
 * 正文中的裸链接自动转成可点击超链接
 * - 仅识别 http(s)；遇到中英文标点即截断，避免把中文句号吞进 href
 * - 样式复用全局 .prose a（主色 + 下划线），不额外定义
 */
const URL_PATTERN = /(https?:\/\/[^\s<>"'，。、；：！？（）【】《》“”‘’]+)/g

function linkify(text) {
  if (typeof text !== 'string' || !text) return text
  const parts = text.split(URL_PATTERN)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    ),
  )
}

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
            <li key={i}>{linkify(li)}</li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol key={idx} className={styles.blockList}>
          {block.items.map((li, i) => (
            <li key={i}>{linkify(li)}</li>
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
          {linkify(block.text)}
        </blockquote>
      )
    case 'p':
    default:
      return (
        <p key={idx} className={styles.blockParagraph}>
          {linkify(block.text)}
        </p>
      )
  }
}

export default function NewsDetail() {
  const t = useT()
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
      <nav className={styles.breadcrumb} aria-label={t('breadcrumb.label')}>
        <Link to="/">{t('breadcrumb.home')}</Link>
        <span aria-hidden="true">›</span>
        <Link to="/news">{t('breadcrumb.news')}</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{t('breadcrumb.newsDetail')}</span>
      </nav>

      <article className={styles.newsArticle}>
        <header className={styles.newsHead}>
          <div className={styles.metaRow}>
            <Tag variant="primary">{item.category}</Tag>
            <span className={styles.newsDate}>{item.date}</span>
            {item.source && (
              <span className={styles.newsSource}>{t('news.source', { source: item.source })}</span>
            )}
          </div>
          <h1 className={styles.newsTitle}>{item.title}</h1>
          {item.cover && (
            <div className={styles.newsCover}>
              <img
                src={assetUrl(item.cover)}
                alt={item.title}
                className={`${styles.newsCoverImg}${
                  item.coverFit === 'contain' ? ` ${styles.newsCoverContain}` : ''
                }`}
              />
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
              {t('common.viewOriginal')}
            </a>
          )}
          <button type="button" className={styles.copyBtn} onClick={copyLink}>
            <Icon name={copied ? 'check' : 'copy'} size={16} />
            {copied ? t('common.linkCopied') : t('common.copyLink')}
          </button>
        </div>

        <nav className={styles.prevNext} aria-label={t('news.prevNext')}>
          {prev ? (
            <Link to={`/news/${prev.id}`} className={styles.pnItem}>
              <span className={styles.pnLabel}>{t('news.prev')}</span>
              <span className={styles.pnTitle}>{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/news/${next.id}`} className={`${styles.pnItem} ${styles.pnNext}`}>
              <span className={styles.pnLabel}>{t('news.next')}</span>
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
