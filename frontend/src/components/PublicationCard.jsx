import { Link } from 'react-router-dom'
import Icon from './Icon'
import Tag from './Tag'
import directions from '../data/directions.json'
import styles from './PublicationCard.module.css'

/**
 * 论文条目（design.md C-08，列表式）
 * 通讯作者加粗并标注 *
 */
export default function PublicationCard({ paper }) {
  const authorText = paper.authors
    .map((a) => (a.corresponding ? `${a.name}*` : a.name))
    .join(', ')

  return (
    <article className={styles.item}>
      <Link to={`/publications/${paper.id}`} className={styles.mainLink}>
        <div className={styles.metaRow}>
          <span className={styles.year}>{paper.year}</span>
          <Tag variant="neutral">{paper.type}</Tag>
          {paper.research_direction.map((d) => {
            const dir = directions.find((x) => x.id === d)
            return dir ? (
              <Tag key={d} variant="primary">
                {dir.title.split('与')[0]}
              </Tag>
            ) : null
          })}
        </div>
        <h3 className={styles.title}>{paper.title}</h3>
        <p className={styles.authors}>{authorText}</p>
        <p className={styles.venue}>
          {paper.venue}
          <span className={styles.venueNote}>（通讯作者以 * 标注）</span>
        </p>
      </Link>
      {paper.doi && (
        <a
          className={styles.doi}
          href={paper.doi}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${paper.title} 外部链接`}
          title="查看原文"
        >
          <Icon name="external" size={18} />
        </a>
      )}
    </article>
  )
}
