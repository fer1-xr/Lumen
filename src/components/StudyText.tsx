import { memo, useMemo } from 'react'
import { COLORS, useStore, type Highlight, type Note } from '../lib/store'
import { parseRich } from '../lib/rich'
import { useUI } from '../lib/ui'

const colorHex = Object.fromEntries(COLORS.map((c) => [c.id, c.hex]))

interface Props {
  refId: string
  html: string
  label: string
  className?: string
  as?: 'span' | 'p' | 'div'
}

/** Texto anotable: muestra resaltados y subrayado de comentarios para una referencia */
export const StudyText = memo(function StudyText({ refId, html, label, className, as = 'span' }: Props) {
  const all = useStore((s) => s.highlights)
  const allNotes = useStore((s) => s.notes)
  const hls = useMemo(() => all.filter((h) => h.ref === refId), [all, refId])
  const notes = useMemo(() => allNotes.filter((n) => n.ref === refId && n.end !== undefined), [allNotes, refId])
  const { text, marks } = useMemo(() => parseRich(html), [html])
  const segs = useMemo(() => segment(text, marks, hls, notes), [text, marks, hls, notes])
  const Tag = as
  return (
    <Tag className={'st ' + (className || '')} data-ref={refId} data-label={label}>
      {segs.map((s, i) => {
        const style = s.hl ? { background: colorHex[s.hl.color] } : undefined
        const cls = [s.em && 'i', s.strong && 'b', s.hl && 'hl', s.noted && 'noted'].filter(Boolean).join(' ')
        return (
          <span key={i} className={cls || undefined} style={style}>
            {s.text}
          </span>
        )
      })}
    </Tag>
  )
})

interface Seg {
  text: string
  em?: boolean
  strong?: boolean
  hl?: Highlight
  noted?: boolean
}

function segment(text: string, marks: { start: number; end: number; type: string }[], hls: Highlight[], notes: Note[]): Seg[] {
  const cuts = new Set<number>([0, text.length])
  for (const m of marks) cuts.add(m.start), cuts.add(m.end)
  for (const h of hls) cuts.add(Math.min(h.start, text.length)), cuts.add(Math.min(h.end, text.length))
  for (const n of notes) cuts.add(Math.min(n.start!, text.length)), cuts.add(Math.min(n.end!, text.length))
  const pts = [...cuts].sort((a, b) => a - b)
  const sortedH = [...hls].sort((a, b) => a.created - b.created)
  const out: Seg[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    if (b <= a) continue
    const seg: Seg = { text: text.slice(a, b) }
    for (const m of marks) if (m.start <= a && m.end >= b) seg[m.type as 'em' | 'strong'] = true
    for (const h of sortedH) if (h.start <= a && h.end >= b) seg.hl = h
    for (const n of notes) if (n.start! <= a && n.end! >= b) seg.noted = true
    out.push(seg)
  }
  return out
}

/** Botón que muestra cuántos comentarios tiene una referencia */
export function NoteBadge({ refId, label }: { refId: string; label: string }) {
  const notes = useStore((s) => s.notes)
  const count = useMemo(() => notes.filter((n) => n.ref === refId).length, [notes, refId])
  const openDrawer = useUI((s) => s.openDrawer)
  if (!count) return null
  return (
    <button
      className="note-badge"
      title="Ver comentarios"
      onClick={(e) => {
        e.stopPropagation()
        openDrawer({ type: 'notes', ref: refId, label })
      }}
    >
      💬{count > 1 ? count : ''}
    </button>
  )
}
