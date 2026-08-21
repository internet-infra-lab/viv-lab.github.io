import { Link } from 'react-router-dom'
import Card from './Card'
import assetUrl from '../utils/asset'
import styles from './MemberCard.module.css'

/**
 * 成员卡片（design.md C-07）：照片（缺失时用姓名首字占位）+ 姓名 + 身份
 */
export default function MemberCard({ member }) {
  const initials = member.name.slice(-2)

  return (
    <Card className={styles.card}>
      <Link to={`/team/${member.id}`} className={styles.link}>
        <div className={styles.photoWrap}>
          {member.photo ? (
            <img className={styles.photo} src={assetUrl(member.photo)} alt={member.name} loading="lazy" />
          ) : (
            <span className={styles.avatar} aria-hidden="true">
              {initials}
            </span>
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{member.name}</h3>
          <p className={styles.grade}>{member.grade || member.title}</p>
        </div>
      </Link>
    </Card>
  )
}
