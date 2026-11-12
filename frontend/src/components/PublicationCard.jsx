import { Link } from 'react-router-dom'
import Icon from './Icon'
import Tag from './Tag'
import directions from '../data/directions.json'
import { getDirectionConfig } from '../config/researchDirections'
import { useLang, useT } from '../i18n/LangContext'
import styles from './PublicationCard.module.css'

const TYPE_KEY = { 期刊: 'pub.type.journal', 会议: 'pub.type.conference', 专利: 'pub.type.patent' }

/**
 * 论文条目（design.md C-08，列表式）
 * 通讯作者加粗并标注 *
 */
export default function PublicationCard({ paper }) {
  const { lang } = useLang()
  const t = useT()
  const authorText = paper.authors
    .map((a) => (a.corresponding ? `${a.name}*` : a.name))
    .join(', ')

  return (
    <article className={styles.item}>
      <Link to={`/publications/${paper.id}`} className={styles.mainLink}>
        <div className={styles.metaRow}>
          <span className={styles.year}>{paper.year}</span>
          <Tag variant="neutral">{TYPE_KEY[paper.type] ? t(TYPE_KEY[paper.type]) : paper.type}</Tag>
          {paper.research_direction.map((d) => {
            const dir = directions.find((x) => x.id === d)
            if (!dir) return null
            const config = getDirectionConfig(d)
            return (
              <Tag key={d} variant="primary">
                {lang === 'en'
                  ? config?.enShort || config?.en || dir.title
                  : dir.title.split('与')[0]}
              </Tag>
            )
          })}
        </div>
        <h3 className={styles.title}>{paper.title}</h3>
        <p className={styles.authors}>{authorText}</p>
        <p className={styles.venue}>
          {paper.venue}
          {lang === 'en' ? ' ' : null}
          <span className={styles.venueNote}>{t('home.corresponding')}</span>
        </p>
      </Link>
      {paper.doi && (
        <a
          className={styles.doi}
          href={paper.doi}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${paper.title} external link`}
          title={t('common.viewOriginal')}
        >
          <Icon name="external" size={18} />
        </a>
      )}
    </article>
  )
}
