import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { COLORS, useStore, type ColorId, type Highlight, type Note } from '../lib/store'
import { refLabel, refLink, refModule } from '../lib/refs'
import { loadBook, normalize, parseVerseRef, bookNames } from '../lib/bible'
import { plain } from '../lib/rich'
import { CIC } from '../data/catecismo'
import { loadVatDoc, loadVatIndex } from '../lib/vaticano'
import { SANTOS } from '../data/santos'
import { ORACIONES } from '../data/oraciones'
import { useUI } from '../lib/ui'
import { useIndex } from './Bible'
import { Annotator } from '../components/Annotator'
import { StudyText } from '../components/StudyText'

const colorOf = Object.fromEntries(COLORS.map((c) => [c.id, c]))

async function refText(ref: string): Promise<string> {
  const [kind, rest = ''] = ref.split(/:(.*)/s)
  if (kind === 'b') {
    const [b, c, v] = rest.split('.')
    const book = await loadBook(b)
    const verse = book.chapters.find((x) => x.c === +c)?.v.find((x) => x.n === +v)
    return verse ? plain(verse.t) : ''
  }
  const [id, part = ''] = rest.split(':')
  const pick = (o: { summary?: string; key?: string[] } | undefined) => (part === 's' ? o?.summary : o?.key?.[+part.slice(1)]) || ''
  if (kind === 'cic') return plain(pick(CIC.find((u) => u.id === id)))
  if (kind === 'enc') {
    await loadVatIndex()
    const b = await loadVatDoc(id)
    return /^\d+$/.test(part) ? plain(b[+part]?.[1] || '') : ''
  }
  if (kind === 'san') {
    const s = SANTOS.find((u) => u.id === id)
    if (!s) return ''
    return plain(part === 'q' ? s.quote || '' : part === 'l' ? s.lesson : s.bio[+part.slice(1)] || '')
  }
  if (kind === 'ora') return ORACIONES.find((o) => o.id === id)?.text || ''
  return ''
}

function useRefTexts(refs: string[]) {
  const [map, setMap] = useState<Record<string, string>>({})
  const key = refs.join('|')
  useEffect(() => {
    let alive = true
    Promise.all(refs.map(async (r) => [r, await refText(r).catch(() => '')] as const)).then((pairs) => alive && setMap(Object.fromEntries(pairs)))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return map
}

/** Escapa el texto plano para pasarlo a StudyText sin que se interprete como formato */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

type View = 'todo' | 'resaltados' | 'comentarios' | 'marcadores' | 'ajustes'
const MODULES = ['Biblia', 'Catecismo', 'Documentos pontificios', 'Santos', 'Oraciones']

export function Estudio() {
  const [params, setParams] = useSearchParams()
  const view = (params.get('ver') as View) || 'todo'
  const highlights = useStore((s) => s.highlights)
  const notes = useStore((s) => s.notes)
  const bookmarks = useStore((s) => s.bookmarks)
  const setView = (v: View) => {
    const p = new URLSearchParams(params)
    p.set('ver', v)
    setParams(p, { replace: true })
  }
  const verses = new Set([...highlights.map((h) => h.ref), ...notes.map((n) => n.ref)]).size
  return (
    <div className="page">
      <header className="page-head">
        <h1>Resaltados y notas</h1>
        <p className="subtitle">
          Todo lo que resaltas y comentas en la Biblia (y en los demás módulos) se guarda aquí automáticamente, ordenado por libro y capítulo.
        </p>
        <div className="study-stats">
          <div>
            <b>{highlights.length}</b> resaltados
          </div>
          <div>
            <b>{notes.length}</b> comentarios
          </div>
          <div>
            <b>{verses}</b> textos anotados
          </div>
          <div>
            <b>{bookmarks.length}</b> marcadores
          </div>
        </div>
        <div className="tabs">
          {(
            [
              ['todo', '📚 Todo'],
              ['resaltados', '🖍️ Resaltados'],
              ['comentarios', '💬 Comentarios'],
              ['marcadores', '🔖 Marcadores'],
              ['ajustes', '⚙️ Colores y copia de seguridad'],
            ] as [View, string][]
          ).map(([v, l]) => (
            <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
              {l}
            </button>
          ))}
        </div>
      </header>
      {(view === 'todo' || view === 'resaltados' || view === 'comentarios') && <Journal view={view} />}
      {view === 'marcadores' && <MarksTab />}
      {view === 'ajustes' && <SettingsTab />}
    </div>
  )
}

interface Entry {
  ref: string
  module: string
  group: string // encabezado (libro, módulo)
  sub: string // subgrupo (capítulo, documento)
  order: number[]
  hls: Highlight[]
  notes: Note[]
  last: number
}

function Journal({ view }: { view: 'todo' | 'resaltados' | 'comentarios' }) {
  const [params, setParams] = useSearchParams()
  const highlights = useStore((s) => s.highlights)
  const notes = useStore((s) => s.notes)
  const labels = useStore((s) => s.settings.colorLabels)
  const idx = useIndex()
  const [q, setQ] = useState('')
  const [color, setColor] = useState<ColorId | ''>('')
  const [tag, setTag] = useState('')
  const [sort, setSort] = useState<'biblico' | 'recientes'>('biblico')
  const libro = params.get('libro') || ''
  const mod = params.get('modulo') || ''
  const setParam = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }

  const bookOrder = useMemo(() => Object.fromEntries((idx || []).map((b, i) => [b.id, i])), [idx])

  const entries = useMemo(() => {
    const map = new Map<string, Entry>()
    const get = (ref: string) => {
      let e = map.get(ref)
      if (!e) {
        const v = parseVerseRef(ref)
        const module = refModule(ref)
        e = {
          ref,
          module,
          group: v ? bookNames[v.book]?.name || v.book : module,
          sub: v ? `Capítulo ${v.c}` : refLabel(ref).replace(/^CEC · /, ''),
          order: v ? [0, bookOrder[v.book] ?? 99, v.c, v.v] : [1 + MODULES.indexOf(module), 0, 0, 0],
          hls: [],
          notes: [],
          last: 0,
        }
        map.set(ref, e)
      }
      return e
    }
    for (const h of highlights) {
      const e = get(h.ref)
      e.hls.push(h)
      e.last = Math.max(e.last, h.created)
    }
    for (const n of notes) {
      const e = get(n.ref)
      e.notes.push(n)
      e.last = Math.max(e.last, n.updated)
    }
    return [...map.values()]
  }, [highlights, notes, bookOrder])

  const tags = useMemo(() => [...new Set(notes.flatMap((n) => n.text.match(/#[\wáéíóúñü]+/gi) || []))].sort(), [notes])
  const books = useMemo(() => {
    const ids = new Set(entries.map((e) => parseVerseRef(e.ref)?.book).filter(Boolean) as string[])
    return (idx || []).filter((b) => ids.has(b.id))
  }, [entries, idx])

  const base = entries.filter(
    (e) =>
      (view !== 'resaltados' || e.hls.length) &&
      (view !== 'comentarios' || e.notes.length) &&
      (!libro || parseVerseRef(e.ref)?.book === libro) &&
      (!mod || e.module === mod) &&
      (!color || e.hls.some((h) => h.color === color)) &&
      (!tag || e.notes.some((n) => n.text.includes(tag))),
  )
  const texts = useRefTexts(base.map((e) => e.ref))
  const list = base
    .filter((e) => !q || normalize((texts[e.ref] || '') + ' ' + e.notes.map((n) => n.text + ' ' + (n.quote || '')).join(' ') + ' ' + refLabel(e.ref)).includes(normalize(q)))
    .sort((a, b) => (sort === 'recientes' ? b.last - a.last : a.order.reduce((acc, x, i) => acc || x - b.order[i], 0)))

  if (!entries.length)
    return (
      <div className="empty">
        <p>
          <strong>Todavía no tienes resaltados ni comentarios.</strong>
        </p>
        <p>
          En la Biblia, <strong>selecciona un texto</strong> con el dedo o el ratón y elige un color, o pulsa «💬 Comentar». También puedes{' '}
          <strong>tocar un versículo</strong> para resaltarlo entero o comentarlo.
          <br />
          Todo aparecerá aquí automáticamente.
        </p>
        <Link className="btn primary" to="/biblia">
          Ir a la Biblia
        </Link>
      </div>
    )

  // agrupar para mostrar encabezados
  let lastGroup = ''
  let lastSub = ''

  return (
    <>
      <div className="journal-tools">
        <input className="input" placeholder="🔍 Buscar en mis resaltados y comentarios…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="sel" value={libro} onChange={(e) => setParam('libro', e.target.value)}>
          <option value="">Todos los libros</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select className="sel" value={mod} onChange={(e) => setParam('modulo', e.target.value)}>
          <option value="">Todos los módulos</option>
          {MODULES.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <div className="seg">
          <button className={sort === 'biblico' ? 'on' : ''} onClick={() => setSort('biblico')}>
            Orden bíblico
          </button>
          <button className={sort === 'recientes' ? 'on' : ''} onClick={() => setSort('recientes')}>
            Recientes
          </button>
        </div>
        <button className="btn" onClick={() => exportTxt(list, texts, labels)}>
          ⬇️ Descargar (.txt)
        </button>
        <button className="btn" onClick={() => window.print()}>
          🖨️ Imprimir
        </button>
      </div>
      {view !== 'comentarios' && (
        <div className="row gap wrap filters">
          <button className={'chip' + (!color ? ' on' : '')} onClick={() => setColor('')}>
            Todos los colores
          </button>
          {COLORS.map((c) => {
            const n = highlights.filter((h) => h.color === c.id).length
            if (!n) return null
            return (
              <button key={c.id} className={'chip' + (color === c.id ? ' on' : '')} onClick={() => setColor(color === c.id ? '' : c.id)}>
                <span className="dot" style={{ background: c.hex }} /> {labels[c.id]} ({n})
              </button>
            )
          })}
        </div>
      )}
      {view !== 'resaltados' && tags.length > 0 && (
        <div className="row gap wrap filters">
          {tags.map((t) => (
            <button key={t} className={'chip' + (tag === t ? ' on' : '')} onClick={() => setTag(tag === t ? '' : t)}>
              {t}
            </button>
          ))}
        </div>
      )}
      {!list.length && <div className="empty">No hay resultados con estos filtros.</div>}
      <Annotator className="journal">
        {list.map((e) => {
          const showGroup = sort === 'biblico' && e.group !== lastGroup
          const showSub = sort === 'biblico' && (showGroup || e.sub !== lastSub)
          lastGroup = e.group
          lastSub = e.sub
          return (
            <div key={e.ref}>
              {showGroup && <h2 className="j-group">{e.group}</h2>}
              {showSub && <h3 className="j-sub">{e.sub}</h3>}
              <EntryCard e={e} text={texts[e.ref]} />
            </div>
          )
        })}
      </Annotator>
    </>
  )
}

function EntryCard({ e, text }: { e: Entry; text?: string }) {
  const openEditor = useUI((s) => s.openEditor)
  const del = useStore((s) => s.deleteNote)
  const apply = useStore((s) => s.applyHighlight)
  const labels = useStore((s) => s.settings.colorLabels)
  const label = refLabel(e.ref)
  const colors = [...new Set(e.hls.map((h) => h.color))]
  return (
    <article className="j-card">
      <div className="j-head">
        <Link to={refLink(e.ref)} className="j-ref">
          {label}
        </Link>
        <span className="j-colors">
          {colors.map((c) => (
            <span key={c} className="j-color">
              <span className="dot" style={{ background: colorOf[c].hex }} /> {labels[c]}
            </span>
          ))}
        </span>
        <Link to={refLink(e.ref)} className="j-go">
          Ir al texto →
        </Link>
      </div>
      <p className="j-text">{text === undefined ? <span className="muted">Cargando…</span> : <StudyText refId={e.ref} html={esc(text)} label={label} />}</p>
      {e.notes
        .sort((a, b) => a.created - b.created)
        .map((n) => (
          <div key={n.id} className="j-note">
            {n.quote && n.quote.trim() !== (text || '').trim() && <blockquote className="quote">{n.quote}</blockquote>}
            <p className="note-text">{n.text}</p>
            <div className="note-meta">
              <span>💬 {new Date(n.updated).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>
                <button className="link" onClick={() => openEditor({ noteId: n.id, ref: n.ref, label, text: n.text, quote: n.quote })}>
                  Editar
                </button>
                <button className="link danger" onClick={() => confirm('¿Eliminar este comentario?') && del(n.id)}>
                  Eliminar
                </button>
              </span>
            </div>
          </div>
        ))}
      <div className="j-actions">
        <button className="link" onClick={() => openEditor({ ref: e.ref, label, text: '', quote: text })}>
          + Añadir comentario
        </button>
        {e.hls.length > 0 && (
          <button className="link danger" onClick={() => confirm('¿Quitar los resaltados de este texto?') && e.hls.forEach((h) => apply(h.ref, h.start, h.end, null))}>
            Quitar resaltado
          </button>
        )}
      </div>
    </article>
  )
}

function exportTxt(list: Entry[], texts: Record<string, string>, labels: Record<ColorId, string>) {
  const lines: string[] = ['MIS RESALTADOS Y NOTAS', `Exportado el ${new Date().toLocaleString('es')}`, '']
  let group = ''
  for (const e of list) {
    if (e.group !== group) {
      group = e.group
      lines.push('', `=== ${group.toUpperCase()} ===`, '')
    }
    const t = texts[e.ref] || ''
    lines.push(`${refLabel(e.ref)} — ${t.replace(/\n/g, ' ')}`)
    for (const h of e.hls) lines.push(`   🖍 [${labels[h.color]}] «${t.slice(h.start, h.end).replace(/\n/g, ' ')}»`)
    for (const n of e.notes) lines.push(`   💬 ${n.text.replace(/\n/g, '\n      ')}`)
    lines.push('')
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `resaltados-y-notas-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
}

function MarksTab() {
  const bookmarks = useStore((s) => s.bookmarks)
  const toggle = useStore((s) => s.toggleBookmark)
  if (!bookmarks.length) return <div className="empty">Sin marcadores. Usa 🏷️ en la barra del lector para guardar un capítulo.</div>
  return (
    <div className="hl-list">
      {[...bookmarks]
        .sort((a, b) => b.created - a.created)
        .map((b) => (
          <div key={b.id} className="hl-item row between">
            <Link to={refLink(b.ref + '.1').replace('?v=1', '')} className="hl-ref">
              🔖 {b.label}
            </Link>
            <button className="link danger" onClick={() => toggle(b.ref, b.label)}>
              Quitar
            </button>
          </div>
        ))}
    </div>
  )
}

function SettingsTab() {
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const importData = useStore((s) => s.importData)
  const reset = useStore((s) => s.reset)
  const toast = useUI((s) => s.showToast)
  const exportData = () => {
    const s = useStore.getState()
    const data = { app: 'lumen-estudio', version: 1, exported: new Date().toISOString(), highlights: s.highlights, notes: s.notes, bookmarks: s.bookmarks, read: s.read, settings: s.settings }
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `mi-estudio-biblico-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
  }
  const doImport = (f: File) => {
    f.text().then((t) => {
      try {
        const d = JSON.parse(t)
        if (!d || typeof d !== 'object' || !Array.isArray(d.highlights)) throw new Error()
        importData(d)
        toast('Copia restaurada')
      } catch {
        alert('El archivo no es una copia válida.')
      }
    })
  }
  return (
    <div className="settings">
      <section className="card">
        <h3>Significado de cada color</h3>
        <p className="muted small">Define tu propio sistema de resaltado. Se muestra al elegir un color y sirve para filtrar tus resaltados.</p>
        {COLORS.map((c) => (
          <label key={c.id} className="color-row">
            <span className="swatch static" style={{ background: c.hex }} />
            <input className="input" value={settings.colorLabels[c.id]} onChange={(e) => setSettings({ colorLabels: { ...settings.colorLabels, [c.id]: e.target.value } })} />
          </label>
        ))}
      </section>
      <section className="card">
        <h3>Copia de seguridad</h3>
        <p className="muted small">
          Tus resaltados, comentarios y progreso se guardan en este navegador. Exporta una copia para no perderlos o para llevarlos a otro dispositivo.
        </p>
        <div className="row gap wrap">
          <button className="btn primary" onClick={exportData}>
            ⬇️ Exportar copia (.json)
          </button>
          <label className="btn">
            ⬆️ Importar copia
            <input type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && doImport(e.target.files[0])} />
          </label>
          <button className="btn ghost danger" onClick={() => confirm('Esto borrará TODOS tus resaltados, comentarios y progreso. ¿Continuar?') && reset()}>
            Borrar todo
          </button>
        </div>
      </section>
    </div>
  )
}
