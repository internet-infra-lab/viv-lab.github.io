import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import Portrait from '../components/Portrait'
import members from '../data/members.json'
import directions from '../data/directions.json'
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

/** 学历类型文案 */
const DEGREE_LABEL = { phd: '博士生', master: '硕士生' }

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
function StudentPreview({ student: s }) {
  const dirs = (s.research_direction || [])
    .map((id) => DIR_MAP[id])
    .filter(Boolean)
    .slice(0, 3)
  const hasExtra = dirs.length > 0 || s.researchArea || s.homepage

  return (
    <div className={styles.studentPanel} role="group" aria-label={`${s.name} 成员信息`}>
      <div className={styles.panelHead}>
        <h4 className={styles.panelName}>{s.name}</h4>
        <span className={styles.studentDegree}>{DEGREE_LABEL[s.role] || s.title || '研究生'}</span>
      </div>
      <p className={styles.panelGrade}>
        <Icon name="calendar" size={13} />
        {parseGrade(s.grade) || s.grade || '在读'}
      </p>

      {dirs.length > 0 && (
        <div className={styles.panelBlock}>
          <span className={styles.panelLabel}>研究方向</span>
          <div className={styles.panelTags}>
            {dirs.map((d) => (
              <Link key={d.id} to={`/research/${d.id}`}>
                <Tag variant="primary">{d.title}</Tag>
              </Link>
            ))}
          </div>
        </div>
      )}

      {s.researchArea && (
        <div className={styles.panelBlock}>
          <span className={styles.panelLabel}>研究兴趣</span>
          <p className={styles.panelText}>{s.researchArea}</p>
        </div>
      )}

      {s.homepage && (
        <a className={styles.panelLink} href={s.homepage} target="_blank" rel="noopener noreferrer">
          <Icon name="external" size={13} />
          个人主页
        </a>
      )}

      {!hasExtra && <p className={styles.panelEmpty}>研究信息整理中，敬请期待</p>}
    </div>
  )
}

export default function Team() {
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
      <PageHeader
        title="团队成员"
        en="Team Members"
        desc="导师团队与在读、已毕业研究生一览。"
      />

      <div className="container section-pad">
        {/* ---- 导师团队（视觉权重最高：浅蓝衬底 + 大卡片） ---- */}
        <Section
          className={styles.facultyBand}
          title="导师团队"
          en="Faculty"
          index="01"
          subtitle="实验室学术带头人，欢迎对相关方向感兴趣的学子联系导师。"
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
                      aria-label={`${m.name} 个人主页`}
                    >
                      <Portrait name={m.name} src={m.photo} className={styles.facultyPortrait} />
                      <span className={styles.facultyPhotoVeil} aria-hidden="true" />
                      <span className={styles.facultyPhotoHint}>
                        <Icon name="external" size={13} />
                        查看个人主页
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={`/faculty/${m.id}`}
                      className={styles.facultyPhotoLink}
                      aria-label={`${m.name} 个人主页`}
                    >
                      <Portrait name={m.name} src={m.photo} className={styles.facultyPortrait} />
                      <span className={styles.facultyPhotoVeil} aria-hidden="true" />
                      <span className={styles.facultyPhotoHint}>
                        <Icon name="external" size={13} />
                        查看个人主页
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
                            aria-label={`${m.name} 个人主页`}
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
                        访问个人主页
                        <Icon name="external" size={14} />
                      </a>
                    ) : (
                      <Link to={`/faculty/${m.id}`} className={styles.facultyMore}>
                        查看完整履历
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
          title="研究生"
          en="Graduate Students"
          index="02"
          subtitle="在读博士生与硕士生，按入学年级从高到低排列；悬停卡片可查看成员信息预览。"
        >
          {current.length > 0 ? (
            <div className={styles.studentGrid}>
              {current.map((s) => (
                <div key={s.id} className={styles.studentCell}>
                  <article className={styles.studentCard} tabIndex={0}>
                    <Portrait name={s.name} src={s.photo} className={styles.studentPortrait} />
                    <h3 className={styles.studentName}>{s.name}</h3>
                    <p className={styles.studentMeta}>
                      <span className={styles.studentDegree}>
                        {DEGREE_LABEL[s.role] || s.title || '研究生'}
                      </span>
                      <span className={styles.metaDot} />
                      <span className={styles.studentGrade}>
                        {parseGrade(s.grade) || s.grade || ''}
                      </span>
                    </p>
                  </article>

                  {/* 悬停浮出的轻量成员档案 */}
                  <StudentPreview student={s} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>暂无在读研究生</p>
          )}
        </Section>

        {/* ---- 毕业生（小圆圈头像小卡片，独立展示、弱化视觉权重） ---- */}
        <section className={styles.alumniSection} aria-label="毕业生">
          <div className={styles.alumniHead}>
            <h2 className={styles.alumniTitle}>毕业生</h2>
            <span className={styles.alumniEn}>Alumni</span>
            <span className={styles.alumniCount}>{alumni.length} 人</span>
          </div>

          {alumni.length > 0 ? (
            <div className={styles.alumniGrid}>
              {alumni.map((m) => (
                <div key={m.id} className={styles.studentCell}>
                  <article className={styles.alumniCard} tabIndex={0}>
                    <Portrait name={m.name} src={m.photo} className={styles.alumniAvatar} />
                    <div className={styles.alumniInfo}>
                      <h3 className={styles.alumniName}>{m.name}</h3>
                      <p className={styles.alumniMeta}>
                        <span>{DEGREE_LABEL[m.role] || m.title || '研究生'}</span>
                        <span className={styles.alumniYear}>
                          {m.graduationYear ? `${m.graduationYear} 年毕业` : '已毕业'}
                        </span>
                      </p>
                    </div>
                  </article>

                  {/* 悬停浮出的轻量成员档案（与在读研究生一致） */}
                  <StudentPreview student={m} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>暂无毕业生记录</p>
          )}
        </section>
      </div>
    </>
  )
}
