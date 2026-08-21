import { useId } from 'react'
import assetUrl from '../utils/asset'

/**
 * 成员人像（Portrait）
 * - 有真实照片（member.photo）时渲染 <img>，object-fit 由父级控制；
 * - 无照片时渲染「统一风格 AI 人像占位」：学术蓝扁平插画半身像
 *   （发型 / 面部 / 西装领口）+ 姓名末字胸章 + 照片槽虚线框，
 *   全站成员风格一致；接入真实照片 / AI 人像时补充 photo 字段即可。
 * - preserveAspectRatio="xMidYMid slice" 使 SVG 与 <img> 的 cover 裁切行为一致，
 *   头像内容集中在视口中部，保证 3:4 / 4:3 / 1:1 裁切下构图完整。
 */
export default function Portrait({ name, src, className = '' }) {
  const uid = useId()
  if (src) {
    return <img className={className} src={assetUrl(src)} alt={`${name} 照片`} loading="lazy" />
  }

  const initial = name ? name.slice(-1) : ''
  const bgId = `portrait-bg-${uid}`
  const glowId = `portrait-glow-${uid}`
  const gridId = `portrait-grid-${uid}`

  return (
    <svg
      className={className}
      viewBox="0 0 200 240"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${name} 人像占位`}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#eaf1fb" />
          <stop offset="1" stopColor="#d4e3f5" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <pattern id={gridId} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="#1d4e89" strokeOpacity="0.05" strokeWidth="1" />
        </pattern>
      </defs>

      {/* 学术蓝浅底 + 细网格 + 头部柔光 */}
      <rect width="200" height="240" fill={`url(#${bgId})`} />
      <rect width="200" height="240" fill={`url(#${gridId})`} />
      <ellipse cx="100" cy="100" rx="70" ry="74" fill={`url(#${glowId})`} />

      {/* 面部与颈部 */}
      <circle cx="69" cy="99" r="5.5" fill="#f2e8da" />
      <circle cx="131" cy="99" r="5.5" fill="#f2e8da" />
      <circle cx="100" cy="96" r="30" fill="#f2e8da" />
      <rect x="90" y="116" width="20" height="38" fill="#ecdcc6" />
      <rect x="90" y="120" width="20" height="30" fill="#f2e8da" />

      {/* 发型（学术蓝深色短发，统一风格） */}
      <path
        d="M100 48 C127 49 135 63 134 90 C133 106 128 114 123 117 C118 111 109 108 100 108 C91 108 82 111 77 117 C72 114 67 106 66 90 C65 63 73 49 100 48 Z"
        fill="#2e4a70"
      />

      {/* 面部细节：眉眼与浅笑 */}
      <circle cx="88" cy="95" r="2.3" fill="#57493d" fillOpacity="0.55" />
      <circle cx="112" cy="95" r="2.3" fill="#57493d" fillOpacity="0.55" />
      <path
        d="M93 105 Q100 110 107 105"
        fill="none"
        stroke="#b2967a"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 西装（学术蓝）与衬衣 V 领 */}
      <path
        d="M46 240 C48 196 58 164 84 148 C90 144 95 149 100 153 C105 149 110 144 116 148 C142 164 152 196 154 240 Z"
        fill="#425f87"
      />
      <path d="M88 150 L112 150 L100 164 Z" fill="#f2f6fb" />
      <path
        d="M88 150 L96 177 M112 150 L104 177"
        fill="none"
        stroke="#2f4a70"
        strokeOpacity="0.45"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 姓名末字胸章（个人化印记） */}
      <rect x="110" y="156" width="34" height="24" rx="5" fill="#ffffff" fillOpacity="0.85" />
      <rect
        x="110"
        y="156"
        width="34"
        height="24"
        rx="5"
        fill="none"
        stroke="#1d4e89"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      <text
        x="127"
        y="172.5"
        textAnchor="middle"
        fontFamily="'Noto Serif SC', 'Songti SC', Georgia, serif"
        fontSize="15"
        fontWeight="600"
        fill="#1d4e89"
        fillOpacity="0.85"
      >
        {initial}
      </text>

      {/* 照片槽虚线框：提示此处为可替换的照片区域 */}
      <rect
        x="8"
        y="8"
        width="184"
        height="224"
        rx="14"
        fill="none"
        stroke="#1d4e89"
        strokeOpacity="0.14"
        strokeWidth="1.5"
        strokeDasharray="3 6"
      />
    </svg>
  )
}
