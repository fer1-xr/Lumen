import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { COLORS, useStore, type ColorId } from '../lib/store'
import { refLabel, refLink, refModule } from '../lib/refs'
import { loadBook, normalize } from '../lib/bible'
import { plain } from '../lib/rich'
import { CIC } from '../data/catecismo'
import { ENCICLICAS } from '../data/enciclicas'
import { SANTOS } from '../data/santos'
import { ORACIONES } from '../data/oraciones'
import { useUI } from '../lib/ui'

const hex = Object.fromEntries(COLORS.map((c) => [c.id, c.hex]))

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
  if (kind === 'cic') return pick(CIC.find((u) => u.id === id))
  if (kind === 'enc') return pick(ENCICLICAS.find((u) => u.id === id))
  if (kind === 'san') {
    const s = SANTOS.find((u) => u.id === id)
    if (!s) return ''
    return part === 'q' ? s.quote || '' : part === 'l' ? s.lesson : s.bio[+part.slice(1)] || ''
  }
  if (kind === 'ora') return ORACIONES.find((o) => o.id === id)?.text || ''
  return ''
}

function useRefTexts(refs: string[]) {
  const [map, setMap] = useState<Record<string, string>>({})
  const key = refs.join('|')
  useEffect(() => {
    let alive = true
    Promise.all(refs.map(async (r) => [r, plain(await refText(r))] as const)).then((pairs) => alive && setMap(Object.fromEntries(pairs)))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return map
}

export function Estudio() {
  const [tab, setTab] = useState<'hl' | 'notes' | 'marks' | 'ajustes'>('hl')
  const highlights = useStore((s) => s.highlights)
  const notes = useStore((s) => s.notes)
  const bookmarks = useStore((s) => s.bookmarks)
  return (
    <div className="page">
      <header className="page-head">
        <h1>Mi estudio</h1>
        <p className="subtitle">Todo lo que has resaltado, comentado y guardado, en un solo lugar.</p>
        <div className="tabs">
          <button className={tab === 'hl' ? 'on' : ''} onClick={() => setTab('hl')}>
            🖍️ Resaltados ({highlights.length})
          </button>
          <button className={tab === 'notes' ? 'on' : ''} onClick={() => setTab('notes')}>
            💬 Comentarios ({notes.length})
          </button>
          <button className={tab === 'marks' ? 'on' : ''} onClick={() => setTab('marks')}>
            🔖 Marcadores ({bookmarks.length})
          </button>
          <button className={tab === 'ajustes' ? 'on' : ''} onClick={() => setTab('ajustes')}>
            ⚙️ Colores y copia de seguridad
          </button>
        </div>
      </header>
      {tab === 'hl' && <HighlightsTab />}
      {tab === 'notes' && <NotesTab />}
      {tab === 'marks' && <MarksTab />}
      {tab === 'ajustes' && <SettingsTab />}
    </div>
  )
}

function HighlightsTab() {
  const highlights = useStore((s) => s.highlights)
  const labels = useStore((s) => s.settings.colorLabels)
  const apply = useStore((s) => s.applyHighlight)
  const [color, setColor] = useState<ColorId | ''>('')
  const [mod, setMod] = useState('')
  const list = useMemo(
    () => highlights.filter((h) => (!color || h.color === color) && (!mod || refModule(h.ref) === mod)).sort((a, b) => b.created - a.created),
    [highlights, color, mod],
  )
  const texts = useRefTexts([...new Set(list.slice(0, 200).map((h) => h.ref))])
  if (!highlights.length)
    return (
      <div className="empty">
        Aún no tienes resaltados. En la Biblia (o en cualquier módulo) <strong>selecciona un texto</strong> y elige un color, o toca un versículo.
        <div>
          <Link className="btn primary" to="/biblia">
            Ir a la Biblia
          </Link>
        </div>
      </div>
    )
  return (
    <>
      <div className="row gap wrap filters">
        <button className={'chip' + (!color ? ' on' : '')} onClick={() => setColor('')}>
          Todos
        </button>
        {COLORS.map((c) => (
          <button key={c.id} className={'chip' + (color === c.id ? ' on' : '')} onClick={() => setColor(c.id)}>
            <span className="dot" style={{ background: c.hex }} /> {labels[c.id]} ({highlights.filter((h) => h.color === c.id).length})
          </button>
        ))}
        <select className="sel" value={mod} onChange={(e) => setMod(e.target.value)}>
          <option value="">Todos los módulos</option>
          {['Biblia', 'Catecismo', 'Encíclicas', 'Santos', 'Oraciones'].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>
      <div className="hl-list">
        {list.map((h) => {
          const t = texts[h.ref]
          return (
            <div key={h.id} className="hl-item">
              <Link to={refLink(h.ref)} className="hl-ref">
                {refLabel(h.ref)}
              </Link>
              <p className="hl-text">
                {t === undefined ? '…' : <span style={{ background: hex[h.color] }}>{t.slice(h.start, h.end)}</span>}
              </p>
              <div className="hl-meta">
                <span className="dot" style={{ background: hex[h.color] }} /> {labels[h.color]} · {new Date(h.created).toLocaleDateString('es')}
                <button className="link danger" onClick={() => apply(h.ref, h.start, h.end, null)}>
                  Quitar
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

function NotesTab() {
  const notes = useStore((s) => s.notes)
  const del = useStore((s) => s.deleteNote)
  const openEditor = useUI((s) => s.openEditor)
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const tags = useMemo(() => [...new Set(notes.flatMap((n) => n.text.match(/#[\wáéíóúñ]+/gi) || []))].sort(), [notes])
  const list = notes
    .filter((n) => (!q || normalize(n.text + (n.quote || '')).includes(normalize(q))) && (!tag || n.text.includes(tag)))
    .sort((a, b) => b.updated - a.updated)
  if (!notes.length)
    return <div className="empty">Aún no has escrito comentarios. Selecciona un texto y pulsa «💬 Comentar».</div>
  return (
    <>
      <div className="row gap wrap filters">
        <input className="input" placeholder="Buscar en mis comentarios…" value={q} onChange={(e) => setQ(e.target.value)} />
        {tags.map((t) => (
          <button key={t} className={'chip' + (tag === t ? ' on' : '')} onClick={() => setTag(tag === t ? '' : t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="notes-list">
        {list.map((n) => (
          <div key={n.id} className="note-card">
            <div className="row between">
              <Link to={refLink(n.ref)} className="hl-ref">
                {refLabel(n.ref)}
              </Link>
              <span className="muted small">{new Date(n.updated).toLocaleDateString('es')}</span>
            </div>
            {n.quote && <blockquote className="quote">{n.quote}</blockquote>}
            <p className="note-text">{n.text}</p>
            <div className="note-meta">
              <span className="tag">{refModule(n.ref)}</span>
              <span>
                <button className="link" onClick={() => openEditor({ noteId: n.id, ref: n.ref, label: refLabel(n.ref), text: n.text, quote: n.quote })}>
                  Editar
                </button>
                <button className="link danger" onClick={() => confirm('¿Eliminar este comentario?') && del(n.id)}>
                  Eliminar
                </button>
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
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
        <p className="muted small">Define tu propio sistema de resaltado. Se muestra al elegir un color.</p>
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
