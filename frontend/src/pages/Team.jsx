import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import Portrait from '../components/Portrait'
import members from '../data/members.json'
import directions from '../data/directions.json'
import { getDirectionConfig } from '../config/researchDirections'
import { useLang, useT } from '../i18n/LangContext'
import styles from './Team.module.css'

/**
 * 团队成员页（科研团队展示，非人员管理系统）
 * 结构：导师团队（篇幅大、权重最高）→ 研究生（紧凑小卡，一排六个）→ 毕业生（小圆圈头像小卡片）
 * 说明：
 * - 仅基于 members.json 现有字段做视觉呈现，不新增关联关系与科研信息；
 * - 学生卡片仅展示 姓名 / 学历 / 年级；毕业生仅展示 姓名 / 学历 / 毕业年份；
 * - 研究生卡片悬停时右侧浮出轻量成员档案（姓名 / 身份 / 年级 / 研究方向标签 / 研究兴趣 / 个人主页），
 *   全部字段由 members.json 驱动，可配置、可留空：
 *   - research_direction: 研究方向 id 数组（与 directions.json 对应，展示前 3 个标签）
 *   - researchArea:      研究兴趣（简短文字）
 *   - homepage:          个人主页链接（新窗口打开）；未填写时不渲染
 *   未来补充真实信息只需在对应成员记录中加字段，无需改动页面。
 * - 头像区域统一使用 Portrait 的「AI 人像占位」，接入真实照片或统一 AI 人像时补充 photo 字段即可。
 */

/** 教师职称排序（导师团队展示顺序，沿用既有逻辑） */
const TITLE_RANK = { 教授: 0, 研究员: 1, 副教授: 2, 副研究员: 3, 讲师: 4, 助理研究员: 5 }

/** 学历类型 → i18n key */
const DEGREE_KEY = { phd: 'team.degree.phd', master: 'team.degree.master', faculty: 'team.degree.faculty' }

/** 研究方向 id → 详情映射（面板标签展示用） */
const DIR_MAP = Object.fromEntries(directions.map((d) => [d.id, d]))

/** 从 grade 提取入学年级，如 "2018级直博生" → "2018级" */
const parseGrade = (grade) => {
  const m = String(grade || '').match(/(20\d{2})级/)
  return m ? `${m[1]}级` : ''
}

/**
 * 研究生悬停详情预览面板（轻量级成员档案，不新增独立详情页）
 * 展示字段全部来自 members.json 可选字段，缺失时自动隐藏并给出「整理中」占位。
 */
function StudentPreview({ student: s, lang }) {
  const t = useT()
  const dirs = (s.research_direction || [])
    .map((id) => DIR_MAP[id])
    .filter(Boolean)
    .slice(0, 3)
  const hasExtra = dirs.length > 0 || s.researchArea || s.homepage

  return (
    <div className={styles.studentPanel} role="group" aria-label={t('team.panel.aria', { name: s.name })}>
      <div className={styles.panelHead}>
        <h4 className={styles.panelName}>{s.name}</h4>
        <span className={styles.studentDegree}>
          {DEGREE_KEY[s.role] ? t(DEGREE_KEY[s.role]) : s.title || t('team.degree.student')}
        </span>
      </div>
      <p className={styles.panelGrade}>
        <Icon name="calendar" size={13} />
        {parseGrade(s.grade) || s.grade || (lang === 'en' ? 'Current' : '在读')}
      </p>

      {dirs.length > 0 && (
        <div className={styles.panelBlock}>
          <span className={styles.panelLabel}>{t('team.panel.direction')}</span>
          <div className={styles.panelTags}>
            {dirs.map((d) => (
              <Link key={d.id} to={`/research/${d.id}`}>
                <Tag variant="primary">
                  {lang === 'en' ? getDirectionConfig(d.id)?.enShort || d.title : d.title}
                </Tag>
              </Link>
            ))}
          </div>
        </div>
      )}

      {s.researchArea && (
        <div className={styles.panelBlock}>
          <span className={styles.panelLabel}>{t('team.panel.interest')}</span>
          <p className={styles.panelText}>{s.researchArea}</p>
        </div>
      )}

      {s.homepage && (
        <a className={styles.panelLink} href={s.homepage} target="_blank" rel="noopener noreferrer">
          <Icon name="external" size={13} />
          {t('team.panel.homepage')}
        </a>
      )}

      {!hasExtra && <p className={styles.panelEmpty}>{t('team.panel.pending')}</p>}
    </div>
  )
}

export default function Team() {
  const t = useT()
  const { lang } = useLang()
  const faculty = members
    .filter((m) => m.role === 'faculty')
    .slice()
    .sort((a, b) => (TITLE_RANK[a.grade] ?? 9) - (TITLE_RANK[b.grade] ?? 9))

  const students = members.filter((m) => m.role === 'phd' || m.role === 'master')

  // 在读研究生：高年级在前（沿用既有逻辑）
  const current = students
    .filter((m) => m.status !== 'graduated')
    .sort((a, b) => parseGrade(a.grade).localeCompare(parseGrade(b.grade)))

  // 已毕业研究生：最近毕业的优先（沿用既有逻辑）
  const alumni = students
    .filter((m) => m.status === 'graduated')
    .sort((a, b) => (b.graduationYear || 0) - (a.graduationYear || 0))

  return (
    <>
      <PageHeader title={t('team.title')} en="Team Members" desc={t('team.desc')} />

      <div className="container section-pad">
        {/* ---- 导师团队（视觉权重最高：浅蓝衬底 + 大卡片） ---- */}
        <Section
          className={styles.facultyBand}
          title={t('team.faculty')}
          en="Faculty"
          index="01"
          subtitle={
            lang === 'en'
              ? 'Academic leads of the lab. Students interested in related directions are welcome to contact them.'
              : '实验室学术带头人，欢迎对相关方向感兴趣的学子联系导师。'
          }
        >
          <div className={styles.facultyGrid}>
            {faculty.map((m, i) => {
              // 有 externalDetail 标记的导师：卡片直接外链到其个人主页，不再使用站内详情页
              const external = m.externalDetail && m.homepage
              const externalProps = {
                href: m.homepage,
                target: '_blank',
                rel: 'noopener noreferrer',
              }
              return (
                <article key={m.id} className={styles.facultyCard}>
                  <span className={styles.facultyIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {external ? (
                    <a
                      {...externalProps}
                      className={styles.facultyPhotoLink}
                      aria-label={t('team.homepage.aria', { name: m.name })}
                    >
                      <Portrait name={m.name} src={m.photo} className={styles.facultyPortrait} />
                      <span className={styles.facultyPhotoVeil} aria-hidden="true" />
                      <span className={styles.facultyPhotoHint}>
                        <Icon name="external" size={13} />
                        {t('team.panel.homepage')}
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={`/faculty/${m.id}`}
                      className={styles.facultyPhotoLink}
                      aria-label={t('team.homepage.aria', { name: m.name })}
                    >
                      <Portrait name={m.name} src={m.photo} className={styles.facultyPortrait} />
                      <span className={styles.facultyPhotoVeil} aria-hidden="true" />
                      <span className={styles.facultyPhotoHint}>
                        <Icon name="external" size={13} />
                        {t('team.panel.homepage')}
                      </span>
                    </Link>
                  )}

                  <div className={styles.facultyBody}>
                    <div className={styles.facultyHead}>
                      <h3 className={styles.facultyName}>
                        {external ? (
                          <a
                            {...externalProps}
                            className={styles.facultyNameLink}
                            aria-label={t('team.homepage.aria', { name: m.name })}
                          >
                            {m.name}
                          </a>
                        ) : (
                          <Link to={`/faculty/${m.id}`} className={styles.facultyNameLink}>
                            {m.name}
                          </Link>
                        )}
                      </h3>
                      <span className={styles.facultyTitle}>{m.title}</span>
                    </div>

                    {m.affiliation && (
                      <p className={styles.facultyAffiliation}>
                        <Icon name="pin" size={13} />
                        {m.affiliation}
                      </p>
                    )}

                    {m.bio && <p className={styles.facultyBio}>{m.bio}</p>}

                    {external ? (
                      <a {...externalProps} className={styles.facultyMore}>
                        {t('detail.homepage')}
                        <Icon name="external" size={14} />
                      </a>
                    ) : (
                      <Link to={`/faculty/${m.id}`} className={styles.facultyMore}>
                        {lang === 'en' ? 'Full profile' : '查看完整履历'}
                        <Icon name="arrowRight" size={14} />
                      </Link>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </Section>

        {/* ---- 研究生（紧凑小卡，一排六个） ---- */}
        <Section
          title={t('team.students')}
          en="Graduate Students"
          index="02"
          subtitle={t('team.studentsDesc')}
        >
          {current.length > 0 ? (
            <div className={styles.studentGrid}>
              {current.map((s) => (
                <div key={s.id} className={styles.studentCell}>
                  <Link
                    to={`/team/${s.id}`}
                    className={styles.studentLink}
                    aria-label={`${s.name} 个人主页`}
                  >
                    <article className={styles.studentCard}>
                      <Portrait name={s.name} src={s.photo} className={styles.studentPortrait} />
                      <h3 className={styles.studentName}>{s.name}</h3>
                      <p className={styles.studentMeta}>
                        <span className={styles.studentDegree}>
                          {DEGREE_KEY[s.role] ? t(DEGREE_KEY[s.role]) : s.title || t('team.degree.student')}
                        </span>
                        <span className={styles.metaDot} />
                        <span className={styles.studentGrade}>
                          {parseGrade(s.grade) || s.grade || ''}
                        </span>
                      </p>
                    </article>
                  </Link>

                  {/* 悬停浮出的轻量成员档案 */}
                  <StudentPreview student={s} lang={lang} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>{t('team.emptyStudents')}</p>
          )}
        </Section>

        {/* ---- 毕业生（小圆圈头像小卡片，独立展示、弱化视觉权重） ---- */}
        <section className={styles.alumniSection} aria-label={t('team.alumni')}>
          <div className={styles.alumniHead}>
            <h2 className={styles.alumniTitle}>{t('team.alumni')}</h2>
            <span className={styles.alumniEn}>Alumni</span>
            <span className={styles.alumniCount}>{t('team.alumniCount', { n: alumni.length })}</span>
          </div>

          {alumni.length > 0 ? (
            <div className={styles.alumniGrid}>
              {alumni.map((m) => (
                <div key={m.id} className={styles.studentCell}>
                  <Link
                    to={`/team/${m.id}`}
                    className={styles.studentLink}
                    aria-label={t('team.homepage.aria', { name: m.name })}
                  >
                    <article className={styles.alumniCard}>
                      <Portrait name={m.name} src={m.photo} className={styles.alumniAvatar} />
                      <div className={styles.alumniInfo}>
                        <h3 className={styles.alumniName}>{m.name}</h3>
                        <p className={styles.alumniMeta}>
                          <span>
                            {DEGREE_KEY[m.role] ? t(DEGREE_KEY[m.role]) : m.title || t('team.degree.student')}
                          </span>
                          <span className={styles.alumniYear}>
                            {m.graduationYear
                            ? t('team.graduatedYear', { year: m.graduationYear })
                            : t('team.graduated')}
                          </span>
                        </p>
                      </div>
                    </article>
                  </Link>

                  {/* 悬停浮出的轻量成员档案（与在读研究生一致） */}
                  <StudentPreview student={m} lang={lang} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>{t('team.emptyAlumni')}</p>
          )}
        </section>
      </div>
    </>
  )
}
