import type { Santo } from '../data/santos'

/** Estandarte heráldico generado para cada santo: colores litúrgicos + emblema + lema */
const PALETTES: [string, string, string][] = [
  ['#6b1f33', '#f3e3bf', '#b8892f'],
  ['#1f3d6b', '#ffffff', '#d8b25f'],
  ['#2f5e3a', '#f6efdc', '#b8892f'],
  ['#4b2a6b', '#f3e3bf', '#d8b25f'],
  ['#8c2b20', '#fff6e0', '#e0b04a'],
  ['#1d4f5e', '#eef6f2', '#c9a24a'],
]

function hash(s: string) {
  let h = 7
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export function flagColors(s: Santo): [string, string, string] {
  const txt = (s.patron + s.bio.join(' ')).toLowerCase()
  if (s.id === 'maria' || /virgen|mariano|guadalupe|lourdes/.test(txt) && s.id !== 'juan-diego') return PALETTES[1]
  if (/mártir|martirio|decapitad|crucificad|lapidad/.test(txt)) return PALETTES[4]
  return PALETTES[hash(s.id) % PALETTES.length]
}

export function SaintFlag({ s, size = 260 }: { s: Santo; size?: number }) {
  const [a, b, g] = flagColors(s)
  const v = hash(s.id) % 3
  const motto = (s.lesson.split(/[.,;:]/)[0] || s.name).slice(0, 38)
  const id = 'fl-' + s.id
  return (
    <svg viewBox="0 0 200 260" width={size * 0.77} height={size} className="saint-flag" role="img" aria-label={`Estandarte de ${s.name}`}>
      <defs>
        <clipPath id={id}>
          <path d="M20 20 H180 V210 L100 245 L20 210 Z" />
        </clipPath>
        <linearGradient id={id + 'sh'} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity=".18" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".08" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="184" height="6" rx="3" fill={g} />
      <circle cx="8" cy="11" r="6" fill={g} />
      <circle cx="192" cy="11" r="6" fill={g} />
      <g clipPath={`url(#${id})`}>
        <rect x="0" y="0" width="200" height="260" fill={a} />
        {v === 0 && <rect x="80" y="0" width="40" height="260" fill={b} />}
        {v === 0 && <rect x="0" y="95" width="200" height="40" fill={b} />}
        {v === 1 && <path d="M0 0 L200 260 V0 Z" fill={b} opacity=".9" />}
        {v === 2 && <rect x="0" y="0" width="200" height="120" fill={b} />}
        <rect x="0" y="0" width="200" height="260" fill={`url(#${id}sh)`} />
      </g>
      <path d="M20 20 H180 V210 L100 245 L20 210 Z" fill="none" stroke={g} strokeWidth="5" />
      <circle cx="100" cy="115" r="44" fill="#fff" stroke={g} strokeWidth="4" />
      <text x="100" y="131" textAnchor="middle" fontSize="44">{s.emoji}</text>
      <path d="M100 52 v-18 M91 41 h18" stroke={g} strokeWidth="4" strokeLinecap="round" />
      <rect x="22" y="176" width="156" height="24" rx="4" fill={g} />
      <text x="100" y="192" textAnchor="middle" fontSize={motto.length > 28 ? 8.5 : 10} fill="#2b2320" fontFamily="Georgia, serif" fontStyle="italic">
        {motto}
      </text>
    </svg>
  )
}
