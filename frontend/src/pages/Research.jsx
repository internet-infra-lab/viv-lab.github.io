import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import Card from '../components/Card'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import { RESEARCH_DIRECTIONS } from '../config/researchDirections'
import { PROJECTS } from '../config/projects'
import { LAB_STATS } from '../utils/stats'
import { useLang, useT } from '../i18n/LangContext'
import styles from './Research.module.css'

/**
 * 研究方向与科研项目（合并栏目，/research）
 * 结构：01 核心研究方向（4 个方向卡）→ 02 科研项目（数据就绪前展示正式整理区）
 * 数据：科研项目列表来自 config/projects.js（未来可切换为 data/projects.json），
 *       当前为空数组，不虚构项目，页面以正式面板提示"资料整理中"。
 */
export default function Research() {
  const t = useT()
  const { lang } = useLang()
  return (
    <>
      <PageHeader
        title={t('research.title')}
        en="Research"
        desc={
          lang === 'en' ? (
            <>
              The lab positions itself on “data interoperation infrastructure for the intelligent
              internet”, conducting fundamental research across {LAB_STATS.directionCount} core
              directions and advancing funded projects. For the bigger picture, see
              <Link to="/about" className={styles.descLink}>
                About the Lab
              </Link>
              .
            </>
          ) : (
            <>
              实验室围绕「面向智能互联网的数据互操作基础设施」定位，在 {LAB_STATS.directionCount}{' '}
              个核心方向上开展基础研究与关键技术攻关，并依托相关课题推进科研项目。实验室整体情况见
              <Link to="/about" className={styles.descLink}>
                实验室介绍
              </Link>
              。
            </>
          )
        }
      />

      <div className="container section-pad">
        {/* ---- 01 核心研究方向 ---- */}
        <Section title={t('research.directions')} en="Research Directions" index="01">
          <div className={styles.grid}>
            {RESEARCH_DIRECTIONS.map((d, i) => (
              <Card key={d.id} className={styles.card}>
                <Link to={`/research/${d.id}`} className={styles.link}>
                  <span className={styles.index} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.head}>
                    <span className={styles.icon}>
                      <Icon name={d.icon} size={26} />
                    </span>
                    <div>
                      <h2 className={styles.title}>{lang === 'en' ? d.en : d.title}</h2>
                      <span className={styles.en}>{lang === 'en' ? '' : d.en}</span>
                    </div>
                  </div>
                  <p className={styles.summary}>{d.summary}</p>
                  <div className={styles.tags}>
                    {d.keywords.slice(0, 3).map((k) => (
                      <Tag key={k} variant="primary">
                        {k}
                      </Tag>
                    ))}
                  </div>
                  <span className={styles.more}>
                    {t('research.learnMore')}
                    <Icon name="arrowRight" size={16} />
                  </span>
                </Link>
              </Card>
            ))}
          </div>
        </Section>

        {/* ---- 02 科研项目 ---- */}
        <Section title={t('research.projects')} en="Research Projects" index="02">
          {PROJECTS.length > 0 ? (
            <div className={styles.projectGrid}>
              {PROJECTS.map((p) => (
                <article key={p.id} className={styles.projectCard}>
                  <div className={styles.projectHead}>
                    {p.type && <span className={styles.projectType}>{p.type}</span>}
                    {p.status && <span className={styles.projectStatus}>{p.status}</span>}
                  </div>
                  <h3 className={styles.projectTitle}>{p.title}</h3>
                  {p.summary && <p className={styles.projectSummary}>{p.summary}</p>}
                  {(p.period || p.pi) && (
                    <p className={styles.projectMeta}>
                      {p.period}
                      {p.period && p.pi ? ' · ' : ''}
                      {p.pi}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.projectsPending}>
              <span className={styles.projectsPendingIcon}>
                <Icon name="hpc" size={26} />
              </span>
              <div className={styles.projectsPendingBody}>
                <h3 className={styles.projectsPendingTitle}>{t('research.pending')}</h3>
                <p className={styles.projectsPendingDesc}>
                  {t('research.pendingDesc')}
                </p>
                <Link to="/join-us#contact" className={styles.projectsPendingCta}>
                  <Icon name="mail" size={15} />
                  {t('research.contactCta')}
                </Link>
              </div>
            </div>
          )}
        </Section>
      </div>
    </>
  )
}
