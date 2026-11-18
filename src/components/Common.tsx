import { Link } from 'react-router-dom'
import { parseCitation } from '../lib/bible'
import { useStore } from '../lib/store'

/** Enlace a una cita bíblica escrita en texto ("Jn 3,16", "Sal 104(103)") */
export function BibleCite({ text }: { text: string }) {
  const m = /^\s*([1-3]?\s?[A-Za-zÁÉÍÓÚáéíóúñ]+)\s+(\d+)(?:\((\d+)\))?(?:\s*[,:]\s*(\d+))?/.exec(text)
  let to: string | null = null
  if (m) {
    const ch = m[3] || m[2]
    const p = parseCitation(`${m[1]} ${ch}${m[4] ? ',' + m[4] : ''}`)
    if (p) to = `/biblia/${p.book}/${p.c}${p.v ? `?v=${p.v}` : ''}`
  }
  return to ? (
    <Link className="cite" to={to}>
      {text}
    </Link>
  ) : (
    <span className="cite">{text}</span>
  )
}

export function ReadToggle({ k, labelDone = 'Estudiado ✓', label = 'Marcar como estudiado' }: { k: string; label?: string; labelDone?: string }) {
  const read = useStore((s) => s.read[k])
  const setRead = useStore((s) => s.setRead)
  return (
    <button className={'btn ' + (read ? 'done' : 'primary')} onClick={() => setRead(k, !read)}>
      {read ? labelDone : label}
    </button>
  )
}

export function Progress({ value, total, small }: { value: number; total: number; small?: boolean }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <div className={'progress' + (small ? ' small' : '')} title={`${value}/${total}`}>
      <div className="progress-fill" style={{ width: `${pct}%` }} />
      {!small && (
        <span className="progress-label">
          {value}/{total} · {pct}%
        </span>
      )}
    </div>
  )
}
