import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import Card from '../components/Card'
import Icon from '../components/Icon'
import assetUrl from '../utils/asset'
import site from '../data/site.json'
import { LAB_STATS } from '../utils/stats'
import styles from './About.module.css'

/**
 * 实验室介绍页
 * 说明：概况区为单栏宽正文；正文中的团队/在读统计（如"研究人员 X 人、在读研究生 Y 人"）
 * 由 utils/stats.js 从数据文件动态推导并替换，避免与 members.json 不一致。
 */
export default function About() {
  // 动态统计替换：仅替换数据正文中出现的统计短语，未出现则原样保留
  const paragraphs = site.about.paragraphs.map((p) =>
    p
      .replace(/在读研究生 \d+ 人/g, `在读研究生 ${LAB_STATS.currentStudentCount} 人`)
      .replace(/研究人员 \d+ 人/g, `研究人员 ${LAB_STATS.facultyCount} 人`),
  )

  return (
    <>
      <PageHeader
        title="实验室介绍"
        en="About the Lab"
        desc="面向互联网基础资源与数据互操作技术的研究团队。"
      />

      <div className="container section-pad">
        {/* ---- 概况（单栏宽正文） ---- */}
        <Section title="实验室概况" en="Overview">
          <div className={styles.overview}>
            {site.about.lead && <p className={styles.lead}>{site.about.lead}</p>}
            {paragraphs.map((p, i) => (
              <p key={i} className={styles.paragraph}>
                {p}
              </p>
            ))}
          </div>
        </Section>

        {/* ---- 发展历程 ---- */}
        <Section title="发展历程" en="Milestones">
          <ol className={styles.timeline}>
            {site.milestones.map((m, i) => (
              <li key={i} className={styles.timelineItem}>
                <span className={styles.timelineYear}>
                  {m.month ? `${m.year}-${m.month}` : m.year}
                </span>
                <div className={styles.timelineBody}>
                  <h3 className={styles.timelineTitle}>{m.title}</h3>
                  <p className={styles.timelineDesc}>{m.desc}</p>
                  {m.image && (
                    <figure className={styles.timelineFigure}>
                      <img
                        src={assetUrl(m.image)}
                        alt={m.imageCaption || m.title}
                        loading="lazy"
                        className={styles.timelineImg}
                      />
                      {m.imageCaption && (
                        <figcaption className={styles.timelineCaption}>
                          {m.imageCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* ---- 平台与设备 ---- */}
        <Section title="平台与设备" en="Platforms & Facilities">
          <div className={styles.equipmentGrid}>
            {site.about.equipment.map((e) => (
              <Card key={e.name} className={styles.equipmentCard}>
                <h3 className={styles.equipmentName}>{e.name}</h3>
                <p className={styles.equipmentDesc}>{e.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* ---- 荣誉与资质 ---- */}
        <Section title="荣誉与资质" en="Honors">
          <ul className={styles.honors}>
            {site.honors.map((h) => (
              <li key={h.title} className={styles.honorItem}>
                <Icon name="check" size={18} className={styles.honorIcon} />
                <div>
                  <span className={styles.honorTitle}>{h.title}</span>
                  <span className={styles.honorDesc}>{h.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ---- 交叉入口：实验室介绍 ↔ 研究方向（统一科研介绍体系） ---- */}
        <div className={styles.researchLink}>
          <span className={styles.researchLinkText}>
            实验室概况与 {LAB_STATS.directionCount} 个核心研究方向共同构成实验室的科研介绍体系
          </span>
          <Link to="/research" className={styles.researchLinkBtn}>
            进入研究方向
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>
    </>
  )
}
