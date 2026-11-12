import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import papers from '../data/papers.json'
import { memberBySignature, memberPath } from '../utils/authorNames'
import NotFound from './NotFound'
import styles from './detail.module.css'

/** 生成 GB/T 7714 风格引用（PRD Q2 默认值） */
function buildCitation(p) {
  const authors = p.authors.map((a) => a.name).join(', ')
  const year = p.year
  const type = p.type
  if (type === '专利') {
    return `${authors}. ${p.title}: ${p.venue}号[P]. ${year}.`
  }
  return `${authors}. ${p.title}[J]. ${p.venue}, ${year}.`
}

export default function PublicationDetail() {
  const { id } = useParams()
  const paper = papers.find((p) => p.id === id)
  const [copied, setCopied] = useState(false)

  if (!paper) return <NotFound />

  const citation = buildCitation(paper)

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citation)
    } catch {
      // 剪贴板不可用时降级
      const ta = document.createElement('textarea')
      ta.value = citation
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container section-pad">
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/">首页</Link>
        <span aria-hidden="true">›</span>
        <Link to="/publications">学术论文</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">论文详情</span>
      </nav>

      <article>
        <div className={styles.metaRow}>
          <span className={styles.year}>{paper.year}</span>
          <Tag variant="neutral">{paper.type}</Tag>
        </div>

        <h1 className={styles.paperTitle}>{paper.title}</h1>
        <p className={styles.authors}>
          {paper.authors.map((a, i) => {
            const member = memberBySignature(a.name)
            const label = a.corresponding ? `${a.name}*` : a.name
            return (
              <span key={`${a.name}-${i}`}>
                {member ? (
                  <Link to={memberPath(member)} className={styles.authorLink}>
                    {label}
                  </Link>
                ) : (
                  label
                )}
                {i < paper.authors.length - 1 ? ', ' : ''}
              </span>
            )
          })}
        </p>
        <p className={styles.venue}>{paper.venue}</p>

        {paper.abstract && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>摘要</h2>
            <p className={`${styles.paragraph} prose`}>{paper.abstract}</p>
          </section>
        )}

        {paper.keywords && paper.keywords.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>关键词</h2>
            <div className={styles.tags}>
              {paper.keywords.map((k) => (
                <Tag key={k} variant="primary">
                  {k}
                </Tag>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>引用信息</h2>
          <div className={styles.citeBox}>
            <p className={styles.citeText}>{citation}</p>
            <button
              type="button"
              className={styles.citeBtn}
              onClick={copyCitation}
              aria-live="polite"
            >
              <Icon name={copied ? 'check' : 'copy'} size={16} />
              {copied ? '已复制' : '复制引用'}
            </button>
          </div>
        </section>

        {paper.doi && (
          <a
            className={styles.doiLink}
            href={paper.doi}
            target="_blank"
            rel="noopener noreferrer"
          >
            查看原文 / DOI
            <Icon name="external" size={16} />
          </a>
        )}
      </article>
    </div>
  )
}
