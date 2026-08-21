import { Link } from 'react-router-dom'
import Icon from './Icon'
import site from '../data/site.json'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  const quickLinks = [
    { label: '招生招聘', path: '/join-us' },
    { label: '学术论文', path: '/publications' },
    { label: '新闻动态', path: '/news' },
    { label: '研究内容', path: '/research' },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <p className={styles.brandName}>{site.lab.nameZh}</p>
            <p className={styles.brandEn}>{site.lab.nameEn}</p>
            <p className={styles.brandDesc}>
              面向智能互联网的数据互操作基础设施研究，聚焦数据互操作、互联网基础技术与数据安全可信治理。欢迎学术交流与合作。
            </p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>快捷链接</h3>
            <ul className={styles.links}>
              {quickLinks.map((l) => (
                <li key={l.path}>
                  <Link to={l.path} className={styles.link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>友情链接</h3>
            <ul className={styles.links}>
              {site.friendLinks.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {l.label}
                    <Icon name="external" size={12} className={styles.externalIcon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>联系方式</h3>
            <ul className={styles.links}>
              <li className={styles.contactItem}>
                <Icon name="mail" size={16} className={styles.contactIcon} />
                <a href={`mailto:${site.contact.email}`} className={styles.link}>
                  {site.contact.email}
                </a>
              </li>
              <li className={styles.contactItem}>
                <Icon name="phone" size={16} className={styles.contactIcon} />
                <span className={styles.contactText}>{site.contact.phone}</span>
              </li>
              <li className={styles.contactItem}>
                <Icon name="pin" size={16} className={styles.contactIcon} />
                <span className={styles.contactText}>{site.contact.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {year} {site.lab.nameZh} · {site.lab.university}
          </span>
          <span className={styles.beian}>京ICP备 00000000 号（示例）</span>
        </div>
      </div>
    </footer>
  )
}
