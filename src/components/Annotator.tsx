import { useEffect, useRef, useState, type ReactNode } from 'react'
import { COLORS, useStore, type ColorId } from '../lib/store'
import { useUI } from '../lib/ui'

export interface SelPiece {
  ref: string
  label: string
  start: number
  end: number
  text: string
}

function lenTo(el: Element, node: Node, off: number) {
  const r = document.createRange()
  r.setStart(el, 0)
  r.setEnd(node, off)
  return r.toString().length
}

/** Obtiene los fragmentos seleccionados dentro de elementos [data-ref] */
export function readSelection(container: HTMLElement): SelPiece[] {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed || !sel.rangeCount) return []
  const range = sel.getRangeAt(0)
  if (!container.contains(range.commonAncestorContainer)) return []
  const pieces: SelPiece[] = []
  container.querySelectorAll<HTMLElement>('[data-ref]').forEach((el) => {
    if (!range.intersectsNode(el)) return
    const total = el.textContent?.length ?? 0
    const start = el.contains(range.startContainer) ? lenTo(el, range.startContainer, range.startOffset) : 0
    const end = el.contains(range.endContainer) ? lenTo(el, range.endContainer, range.endOffset) : total
    if (end > start) {
      const text = (el.textContent || '').slice(start, end)
      if (text.trim()) pieces.push({ ref: el.dataset.ref!, label: el.dataset.label || '', start, end, text })
    }
  })
  return pieces
}

/** Contenedor que permite resaltar y comentar cualquier texto seleccionado */
export function Annotator({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tool, setTool] = useState<{ x: number; y: number; below: boolean; pieces: SelPiece[] } | null>(null)

  useEffect(() => {
    const el = ref.current!
    let t: number | undefined
    const check = () => {
      clearTimeout(t)
      t = window.setTimeout(() => {
        const pieces = readSelection(el)
        if (!pieces.length) return setTool(null)
        const rect = window.getSelection()!.getRangeAt(0).getBoundingClientRect()
        const touch = matchMedia('(pointer: coarse)').matches
        const below = touch || rect.top < 90
        setTool({
          x: Math.min(Math.max(rect.left + rect.width / 2, 170), window.innerWidth - 170),
          y: below ? rect.bottom + 10 : rect.top - 10,
          below,
          pieces,
        })
      }, 120)
    }
    const onSelChange = () => {
      const s = window.getSelection()
      if (!s || s.isCollapsed) setTool(null)
    }
    el.addEventListener('mouseup', check)
    el.addEventListener('touchend', check)
    el.addEventListener('keyup', check)
    document.addEventListener('selectionchange', onSelChange)
    return () => {
      el.removeEventListener('mouseup', check)
      el.removeEventListener('touchend', check)
      el.removeEventListener('keyup', check)
      document.removeEventListener('selectionchange', onSelChange)
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
      {tool && <SelectionToolbar {...tool} onDone={() => setTool(null)} />}
    </div>
  )
}

function SelectionToolbar({ x, y, below, pieces, onDone }: { x: number; y: number; below: boolean; pieces: SelPiece[]; onDone: () => void }) {
  const apply = useStore((s) => s.applyHighlight)
  const labels = useStore((s) => s.settings.colorLabels)
  const openEditor = useUI((s) => s.openEditor)
  const toast = useUI((s) => s.showToast)
  const finish = () => {
    window.getSelection()?.removeAllRanges()
    onDone()
  }
  const color = (c: ColorId | null) => {
    pieces.forEach((p) => apply(p.ref, p.start, p.end, c))
    finish()
  }
  const label = pieces.length > 1 ? `${pieces[0].label} – ${pieces[pieces.length - 1].label}` : pieces[0].label
  return (
    <div
      className="sel-toolbar"
      style={{ left: x, top: y, transform: `translate(-50%, ${below ? '0' : '-100%'})` }}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {COLORS.map((c) => (
        <button key={c.id} className="swatch" style={{ background: c.hex }} title={`${c.label}: ${labels[c.id]}`} onClick={() => color(c.id)} />
      ))}
      <button className="tb-btn" title="Quitar resaltado" onClick={() => color(null)}>
        ⌫
      </button>
      <span className="tb-sep" />
      <button
        className="tb-btn"
        onClick={() => {
          const p = pieces[0]
          openEditor({
            ref: p.ref,
            start: pieces.length === 1 ? p.start : undefined,
            end: pieces.length === 1 ? p.end : undefined,
            quote: pieces.map((q) => q.text).join(' … '),
            label,
            text: '',
          })
          finish()
        }}
      >
        💬 Comentar
      </button>
      <button
        className="tb-btn"
        onClick={() => {
          navigator.clipboard?.writeText(`«${pieces.map((p) => p.text.trim()).join(' ')}» (${label})`)
          toast('Texto copiado')
          finish()
        }}
      >
        ⧉
      </button>
    </div>
  )
}
