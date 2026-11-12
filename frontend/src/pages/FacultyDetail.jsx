import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import PublicationCard from '../components/PublicationCard'
import assetUrl from '../utils/asset'
import { papersOfMember } from '../utils/authorNames'
import members from '../data/members.json'
import directions from '../data/directions.json'
import papers from '../data/papers.json'
import NotFound from './NotFound'
import shared from './detail.module.css'
import styles from './FacultyDetail.module.css'

/**
 * 导师详情页（PRD 5.3 /faculty/:id）
 * 模块：个人信息（大照片框）→ 研究方向 → 个人简介 → 教育经历 → 工作履历 → 代表论文 → 招生信息
 * 说明：标记了 externalDetail 的导师（如彭博韬）不再使用站内详情页，
 *       访问 /faculty/:id 时自动跳转到其个人主页。
 */

/** 详情页展示的代表论文上限（PRD 5.3：5~10 篇） */
const REPRESENTATIVE_LIMIT = 10

export default function FacultyDetail() {
  const { id } = useParams()
  const member = members.find((m) => m.id === id)
  const external = !!member && member.externalDetail && !!member.homepage

  // 外部主页导师：直接跳转到其个人主页
  useEffect(() => {
    if (external) window.location.replace(member.homepage)
  }, [external]) // eslint-disable-line react-hooks/exhaustive-deps

  // 仅允许访问 role=faculty 的导师档案
  if (!member || member.role !== 'faculty') return <NotFound />

  // 跳转中的过渡态（页面将立即离开）
  if (external) {
    return (
      <div className="container section-pad">
        <p className={shared.none}>
          正在跳转到 {member.name} 的个人主页：
          <a
            href={member.homepage}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--color-primary)' }}
          >
            {member.homepage}
          </a>
        </p>
      </div>
    )
  }

  const initials = member.name.slice(-2)
  const dirMap = Object.fromEntries(directions.map((d) => [d.id, d]))
  const dirs = (member.research_direction || [])
    .map((d) => dirMap[d])
    .filter(Boolean)

  const representatives = papersOfMember(papers, id).slice(0, REPRESENTATIVE_LIMIT)

  return (
    <div className="container section-pad">
      {/* 面包屑（C-09） */}
      <nav className={shared.breadcrumb} aria-label="面包屑">
        <Link to="/">首页</Link>
        <span aria-hidden="true">›</span>
        <Link to="/team">团队成员</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{member.name}</span>
      </nav>

      {/* ---- 个人信息区（大照片框 3:4） ---- */}
      <div className={styles.profile}>
        <div className={styles.photoBlock}>
          {member.photo ? (
            <img className={styles.photoImg} src={assetUrl(member.photo)} alt={member.name} />
          ) : (
            <span className={styles.photoText} aria-hidden="true">
              {initials}
            </span>
          )}
        </div>

        <div className={styles.profileBody}>
          <h1 className={styles.profileName}>{member.name}</h1>
          <p className={styles.profileTitle}>{member.title}</p>

          {member.affiliation && (
            <p className={styles.affiliation}>
              <Icon name="pin" size={16} />
              {member.affiliation}
            </p>
          )}

          {member.researchArea && (
            <p className={styles.area}>研究领域：{member.researchArea}</p>
          )}

          <div className={styles.contact}>
            {member.email && (
              <a className={styles.contactLink} href={`mailto:${member.email}`}>
                <Icon name="mail" size={16} />
                {member.email}
              </a>
            )}
            {member.homepage && (
              <a
                className={styles.contactLink}
                href={member.homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="external" size={16} />
                个人主页
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ---- 研究方向 ---- */}
      {dirs.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>研究方向</h2>
          <div className={styles.dirGrid}>
            {dirs.map((d) => (
              <Link key={d.id} to={`/research/${d.id}`} className={styles.dirCard}>
                <div className={styles.dirHead}>
                  <Icon name={d.icon || 'search'} size={20} />
                  <h3 className={styles.dirName}>{d.title}</h3>
                </div>
                <p className={styles.dirSummary}>{d.summary}</p>
                <span className={styles.dirMore}>
                  了解详情
                  <Icon name="arrowRight" size={14} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---- 个人简介 ---- */}
      {member.bio && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>个人简介</h2>
          <p className={`${shared.paragraph} prose`}>{member.bio}</p>
        </section>
      )}

      {/* ---- 教育经历 ---- */}
      {member.education && member.education.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>教育经历</h2>
          <ol className={styles.timeline}>
            {member.education.map((e, i) => (
              <li key={`${e.school}-${i}`} className={styles.timelineItem}>
                <span className={styles.timelinePeriod}>{e.period}</span>
                <div className={styles.timelineContent}>
                  <span className={styles.timelineMain}>{e.school}</span>
                  <span className={styles.timelineSub}>{e.degree}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---- 工作履历 ---- */}
      {member.experience && member.experience.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>工作履历</h2>
          <ol className={styles.timeline}>
            {member.experience.map((e, i) => (
              <li key={`${e.org}-${i}`} className={styles.timelineItem}>
                <span className={styles.timelinePeriod}>{e.period}</span>
                <div className={styles.timelineContent}>
                  <span className={styles.timelineMain}>{e.org}</span>
                  <span className={styles.timelineSub}>{e.position}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ---- 代表论文（复用论文条目组件 C-08） ---- */}
      {representatives.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>代表论文</h2>
            <Link to="/publications" className={styles.moreLink}>
              查看全部论文
              <Icon name="arrowRight" size={14} />
            </Link>
          </div>
          <div className={shared.paperList}>
            {representatives.map((p) => (
              <PublicationCard key={p.id} paper={p} />
            ))}
          </div>
        </section>
      )}

      {/* ---- 招生信息 ---- */}
      <section className={styles.recruit}>
        <div className={styles.recruitBody}>
          <h2 className={styles.recruitTitle}>招生信息</h2>
          <p className={styles.recruitDesc}>
            本实验室长期招收博士研究生、硕士研究生与博士后研究人员，欢迎对
            {member.researchArea ? `「${member.researchArea}」` : '实验室相关方向'}
            感兴趣的同学通过邮件联系导师。
          </p>
        </div>
        <Link to="/join-us" className={styles.recruitBtn}>
          查看招生招聘
          <Icon name="arrowRight" size={16} />
        </Link>
      </section>
    </div>
  )
}
