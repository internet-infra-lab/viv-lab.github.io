import { Link } from 'react-router-dom'
import Icon from './Icon'
import site from '../data/site.json'
import { useLang, useT } from '../i18n/LangContext'
import styles from './Footer.module.css'

export default function Footer() {
  const t = useT()
  const { lang } = useLang()
  const year = new Date().getFullYear()
  const quickLinks = [
    { label: t('nav.joinUs'), path: '/join-us' },
    { label: t('nav.publications'), path: '/publications' },
    { label: t('nav.news'), path: '/news' },
    { label: t('nav.research'), path: '/research' },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <p className={styles.brandName}>
              {lang === 'en' ? site.lab.nameEn : site.lab.nameZh}
            </p>
            <p className={styles.brandEn}>
              {lang === 'en' ? site.lab.nameZh : site.lab.nameEn}
            </p>
            <p className={styles.brandDesc}>{t('footer.tagline')}</p>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>{t('footer.quickLinks')}</h3>
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
            <h3 className={styles.colTitle}>{t('footer.friends')}</h3>
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
            <h3 className={styles.colTitle}>{t('footer.contact')}</h3>
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
          <span>{t('footer.rights', { year })}</span>
          <span className={styles.beian}>{t('footer.beian')}</span>
        </div>
      </div>
    </footer>
  )
}
