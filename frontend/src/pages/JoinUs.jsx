import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import Icon from '../components/Icon'
import Tag from '../components/Tag'
import site from '../data/site.json'
import { useLang, useT } from '../i18n/LangContext'
import styles from './JoinUs.module.css'

/**
 * 招生招聘页（Join Us）
 * 定位：高校科研实验室面向学生的加入说明页（非企业招聘、非招生系统）
 * 数据：联系邮箱等字段来自 src/data/site.json（contact），不做硬编码
 */

const EMAIL_SUBJECT = '申请加入实验室-姓名-学校-年级-感兴趣方向'

/** 申请邮件正文模板（点击「发送申请邮件」时预填，降低用户填写成本） */
const EMAIL_BODY = [
  '姓名：',
  '学校／院系：',
  '年级（如 2027 级）：',
  '感兴趣的研究方向：',
  '',
  '（请随信附上个人简历、成绩单，以及其他可证明科研能力的材料）',
].join('\n')

/** 申请收件邮箱（硕博研究生申请专用，取自 site.json contact.applyEmail） */
const APPLY_EMAIL = site.contact.applyEmail

/* ---- 招募对象 ---- */
const RECRUIT_GROUPS = [
  {
    icon: 'flask',
    title: '本科生科研 / 毕业设计',
    desc: '面向大二至大四本科生，通过科研训练、毕业设计或寒暑期实习接触真实研究课题，完成从课程学习到独立研究的过渡。',
    points: ['形式：科研训练 / 毕业设计 / 实习', '方向：DNS 安全、数据互操作、数据管理等'],
  },
  {
    icon: 'ml',
    title: '硕士与博士研究生',
    desc: '面向推免、统考与硕博连读申请者，在导师指导下围绕实验室研究方向开展系统研究，发表高水平论文并参与真实系统建设。',
    points: ['形式：推免 / 统考 / 硕博连读', '方向：数据互操作、网络安全、数据管理'],
  },
  {
    icon: 'hpc',
    title: '科研实习与联合培养',
    desc: '面向校内外优秀学生与兄弟院校的交流学习需求，支持短期实习、客座研究与联合培养，共享实验室平台与课题资源。',
    points: ['形式：寒暑期实习 / 客座研究', '要求：能保证一定的科研投入时间'],
  },
]

/* ---- 我们期待 ---- */
const EXPECTS = [
  '对科研有好奇心，愿意探索尚未解决的问题',
  '具备一定的编程和系统实践基础',
  '愿意阅读论文、做实验、实现系统',
  '对实验室研究方向有长期兴趣',
]

/* ---- 你可以参与 ---- */
const PARTICIPATES = [
  {
    title: '真实科研课题',
    desc: '参与国家级项目与实验室自有课题中的真实问题攻关，如 DNS 安全、数据互操作与高维数据检索。',
  },
  {
    title: '原型系统与工程开发',
    desc: '将研究想法落地为可运行的系统和工具，在真实基础设施环境中打磨工程能力。',
  },
  {
    title: '学术论文与实验研究',
    desc: '在导师指导下完成文献调研、实验设计与论文写作的完整科研流程。',
  },
  {
    title: '数据基础设施、安全与治理项目',
    desc: '参与域名系统、身份认证、跨域授权与数据合规等方向的项目建设与标准工作。',
  },
]

/* ---- 研究方向（围绕实验室四条主线） ---- */
const DIRECTIONS = [
  '数据互操作与智能互联网基础设施',
  '数据安全、身份认证与跨域授权',
  '互联网基础资源安全与治理',
  '大规模数据管理与智能计算',
]

/* ---- 联系方式（字段来自 site.json contact，避免硬编码） ---- */
const CONTACTS = [
  {
    key: 'apply',
    label: '硕博研究生申请',
    labelKey: 'join.applyMail',
    email: site.contact.applyEmail,
    note: '推免 / 统考 / 硕博连读 / 博士后',
    noteKey: 'join.applyNote',
  },
  {
    key: 'undergrad',
    label: '本科生科研与毕业设计',
    labelKey: 'join.undergrad',
    email: site.contact.email2,
    note: '科研训练 / 毕业设计 / 实习',
    noteKey: 'join.undergradNote',
  },
  {
    key: 'coop',
    label: '合作与交流',
    labelKey: 'join.coop',
    email: site.contact.email,
    note: '联合培养 / 学术合作',
    noteKey: 'join.coopNote',
  },
]

const isPending = (v) => !v || v.includes('待确认')

export default function JoinUs() {
  const t = useT()
  const { lang } = useLang()
  const [copied, setCopied] = useState(false)

  /** 复制申请邮箱：浏览器未配置邮件客户端时，mailto 不会有反应，提供复制兜底 */
  const copyApplyEmail = async () => {
    try {
      await navigator.clipboard.writeText(APPLY_EMAIL)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = APPLY_EMAIL
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <PageHeader
        title={t('join.title')}
        en="Join Us"
        desc={t('join.desc')}
      />

      <div className="container section-pad">
        {/* ---- 招募对象 ---- */}
        <Section
          title={t('join.who')}
          en="Who We Welcome"
          subtitle={t('join.whoDesc')}
        >
          <div className={styles.groupGrid}>
            {RECRUIT_GROUPS.map((g) => (
              <div key={g.title} className={styles.groupCard}>
                <span className={styles.groupIcon}>
                  <Icon name={g.icon} size={24} />
                </span>
                <h3 className={styles.groupTitle}>{g.title}</h3>
                <p className={styles.groupDesc}>{g.desc}</p>
                <ul className={styles.groupPoints}>
                  {g.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ---- 我们期待 | 你可以参与 ---- */}
        <div className={styles.twoCol}>
          <Section title={t('join.expect')} en="What We Look For">
            <ul className={styles.expectList}>
              {EXPECTS.map((e) => (
                <li key={e} className={styles.expectItem}>
                  <Icon name="check" size={18} className={styles.expectIcon} />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title={t('join.participate')} en="What You'll Do">
            <ol className={styles.participateList}>
              {PARTICIPATES.map((p, i) => (
                <li key={p.title} className={styles.participateItem}>
                  <span className={styles.participateIndex}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.participateBody}>
                    <h4 className={styles.participateTitle}>{p.title}</h4>
                    <p className={styles.participateDesc}>{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        {/* ---- 研究方向 ---- */}
        <section className={styles.directionBand} aria-label="实验室研究方向">
          <div className={styles.directionInner}>
            <h2 className={styles.directionHeading}>{t('join.directions')}</h2>
            <div className={styles.directionTags}>
              {DIRECTIONS.map((d) => (
                <Tag key={d} variant="primary">
                  {d}
                </Tag>
              ))}
            </div>
            <p className={styles.directionNote}>
              {t('join.directionNote')}
            </p>
          </div>
        </section>

        {/* ---- 联系方式 ---- */}
        <Section id="contact" title={t('join.contact')} en="Contact Us" className={styles.contactAnchor}>
          <div className={styles.contactGrid}>
            {CONTACTS.map((c) =>
              isPending(c.email) ? (
                <div key={c.key} className={styles.contactCard}>
                  <span className={styles.contactLabel}>{t(c.labelKey)}</span>
                  <span className={styles.contactPending}>
                    <Icon name="mail" size={14} />
                    {t('join.pendingMail')}
                  </span>
                  <span className={styles.contactNote}>{t(c.noteKey)}</span>
                </div>
              ) : (
                <a key={c.key} className={styles.contactCard} href={`mailto:${c.email}`}>
                  <span className={styles.contactLabel}>{t(c.labelKey)}</span>
                  <span className={styles.contactEmail}>{c.email}</span>
                  <span className={styles.contactNote}>{t(c.noteKey)}</span>
                </a>
              ),
            )}
          </div>

          <div className={styles.subjectBox}>
            <div className={styles.subjectRow}>
              <span className={styles.subjectHead}>
                <Icon name="mail" size={17} />
                {t('join.subject')}
              </span>
              <code className={styles.subjectCode}>{EMAIL_SUBJECT}</code>
            </div>
            <p className={styles.subjectHint}>
              {t('join.subjectHint')}
            </p>
          </div>

          <div className={styles.ctaRow}>
            <a
              className={styles.ctaBtn}
              href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(
                EMAIL_SUBJECT,
              )}&body=${encodeURIComponent(EMAIL_BODY)}`}
            >
              {t('join.sendMail')}
              <Icon name="external" size={16} />
            </a>
            <button type="button" className={styles.ghostBtn} onClick={copyApplyEmail}>
              {copied ? t('join.mailCopied') : t('join.copyMail', { email: APPLY_EMAIL })}
              <Icon name={copied ? 'check' : 'copy'} size={16} />
            </button>
            <Link to="/about" className={styles.ghostBtn}>
              {t('join.learnLab')}
            </Link>
          </div>
        </Section>
      </div>
    </>
  )
}
