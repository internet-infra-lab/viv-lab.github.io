import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import PublicationCard from '../components/PublicationCard'
import Section from '../components/Section'
import Tag from '../components/Tag'
import directions from '../data/directions.json'
import papers from '../data/papers.json'
import { getDirectionConfig } from '../config/researchDirections'
import { useLang, useT } from '../i18n/LangContext'
import NotFound from './NotFound'
import styles from './detail.module.css'

export default function DirectionDetail() {
  const t = useT()
  const { lang } = useLang()
  const { id } = useParams()
  const direction = directions.find((d) => d.id === id)

  if (!direction) return <NotFound />

  // 展示层文案（标题/英文名/关键词）优先取表现层配置，正文内容仍用数据源
  const config = getDirectionConfig(id)
  const displayTitle =
    lang === 'en' ? config?.en || direction.en || config?.title : config?.title || direction.title
  const displayEn = config?.en || direction.en
  const displayKeywords = config?.keywords || direction.keywords

  const relatedPapers = papers
    .filter((p) => p.research_direction.includes(direction.id))
    .sort((a, b) => b.year - a.year)

  return (
    <>
      <PageHeader title={displayTitle} en={displayEn} />

      <div className="container section-pad">
        <div className={styles.tags}>
          {displayKeywords.map((k) => (
            <Tag key={k} variant="primary">
              {k}
            </Tag>
          ))}
        </div>

        {direction.methods && direction.methods.length > 0 && (
          <div className={styles.tags}>
            {direction.methods.map((m) => (
              <Tag key={m} variant="neutral">
                {m}
              </Tag>
            ))}
          </div>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{t('research.direction.detail')}</h2>
          <div className="prose">
            {direction.lead && (
              <p className={styles.paragraph}>{direction.lead}</p>
            )}
            {direction.content.map((p, i) => (
              <p key={i} className={styles.paragraph}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {direction.highlights && direction.highlights.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('research.direction.works')}</h2>
            <ul className={styles.highlightList}>
              {direction.highlights.map((h) => (
                <li key={h.title} className={styles.highlightItem}>
                  <span className={styles.highlightTag}>{h.type}</span>
                  <div>
                    <h3 className={styles.highlightTitle}>{h.title}</h3>
                    <p className={styles.highlightDesc}>{h.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Section title={t('research.direction.related')} en="Related Publications">
          {relatedPapers.length > 0 ? (
            <div className={styles.paperList}>
              {relatedPapers.map((p) => (
                <PublicationCard key={p.id} paper={p} />
              ))}
            </div>
          ) : (
            <p className={styles.none}>{t('research.direction.none')}</p>
          )}
        </Section>

        <Link to="/research" className={styles.backLink}>
          {t('common.backToResearch')}
        </Link>
      </div>
    </>
  )
}
