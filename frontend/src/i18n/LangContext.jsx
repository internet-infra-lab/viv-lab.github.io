import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MESSAGES } from './messages'

/**
 * 全站语言上下文
 *
 * - 语言状态存 localStorage（key: viv-lang），刷新后保持；不写入 URL；
 * - `document.documentElement.lang` 同步为 zh-CN / en，便于无障碍与搜索引擎识别；
 * - 数据层内容（论文、新闻、成员简介等）不做翻译，英文界面下仍显示数据原文；
 *   语言切换作用于界面文案与结构化标签（如论文类型、成员身份、新闻分类）。
 */

const STORAGE_KEY = 'viv-lang'
export const LANGS = ['zh', 'en']

const LangContext = createContext({
  lang: 'zh',
  setLang: () => {},
  t: (key) => key,
})

function readInitialLang() {
  if (typeof window === 'undefined') return 'zh'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    /* localStorage 不可用时退回中文 */
  }
  return 'zh'
}

/** 填充 {n} / {q} 这类占位符 */
function format(template, params) {
  if (!params) return template
  return String(template).replace(/\{(\w+)\}/g, (match, key) =>
    params[key] === undefined || params[key] === null ? match : String(params[key]),
  )
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
    // 页面标题与描述同步语言（静态 index.html 中为中文，切换后即时更新）
    document.title = MESSAGES[lang]?.['site.title'] || document.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', MESSAGES[lang]?.['site.description'] || desc.content)
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* 忽略写入失败 */
    }
  }, [lang])

  const setLang = useCallback((next) => {
    if (LANGS.includes(next)) setLangState(next)
  }, [])

  const t = useCallback(
    (key, params) => {
      const dict = MESSAGES[lang] || MESSAGES.zh
      const value = dict[key]
      if (value === undefined) {
        // 缺失文案时回退中文，避免界面出现 key
        return format(MESSAGES.zh[key] ?? key, params)
      }
      return format(value, params)
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

/** 取语言状态与切换方法 */
export function useLang() {
  return useContext(LangContext)
}

/** 仅取翻译函数 */
export function useT() {
  return useContext(LangContext).t
}
