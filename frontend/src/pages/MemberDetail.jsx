import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import assetUrl from '../utils/asset'
import members from '../data/members.json'
import directions from '../data/directions.json'
import NotFound from './NotFound'
import styles from './detail.module.css'

export default function MemberDetail() {
  const { id } = useParams()
  const member = members.find((m) => m.id === id)

  if (!member) return <NotFound />

  const initials = member.name.slice(-2)
  const dirMap = Object.fromEntries(directions.map((d) => [d.id, d]))

  return (
    <div className="container section-pad">
      {/* 面包屑 */}
      <nav className={styles.breadcrumb} aria-label="面包屑">
        <Link to="/">首页</Link>
        <span aria-hidden="true">›</span>
        <Link to="/team">团队成员</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{member.name}</span>
      </nav>

      <div className={styles.profile}>
        <div className={styles.avatarBlock}>
          {member.photo ? (
            <img className={styles.avatarImg} src={assetUrl(member.photo)} alt={member.name} />
          ) : (
            <span className={styles.avatarText} aria-hidden="true">
              {initials}
            </span>
          )}
        </div>
        <div className={styles.profileBody}>
          <h1 className={styles.profileName}>{member.name}</h1>
          <p className={styles.profileTitle}>{member.title}</p>
          {member.email && (
            <a className={styles.profileEmail} href={`mailto:${member.email}`}>
              <Icon name="mail" size={16} />
              {member.email}
            </a>
          )}
          {member.researchArea && (
            <p className={styles.profileArea}>{member.researchArea}</p>
          )}
          <div className={styles.tags}>
            {member.research_direction.map((d) => (
              <Link key={d} to={`/research/${d}`}>
                <Tag variant="primary">{dirMap[d]?.title}</Tag>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>个人简介</h2>
        <p className={`${styles.paragraph} prose`}>{member.bio}</p>
      </section>

      {member.education && member.education.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>教育经历</h2>
          <ol className={styles.eduList}>
            {member.education.map((e) => (
              <li key={`${e.school}-${e.degree}`} className={styles.eduItem}>
                <span className={styles.eduPeriod}>{e.period}</span>
                <span className={styles.eduSchool}>{e.school}</span>
                <span className={styles.eduDegree}>{e.degree}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
