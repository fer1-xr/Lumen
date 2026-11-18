import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { loadBook, loadIndex, verseRef, chapterKey, type Book, type BookInfo, type Verse, hebrewToVulgatePsalm } from '../lib/bible'
import { COLORS, useStore, type ColorId } from '../lib/store'
import { useUI } from '../lib/ui'
import { Annotator } from '../components/Annotator'
import { StudyText, NoteBadge } from '../components/StudyText'
import { plain } from '../lib/rich'
import { usePlaces, placeName } from '../lib/places'

export function useIndex() {
  const [idx, setIdx] = useState<BookInfo[] | null>(null)
  useEffect(() => {
    loadIndex().then(setIdx)
  }, [])
  return idx
}

/** Lista de libros */
export function BibleHome() {
  const idx = useIndex()
  const read = useStore((s) => s.read)
  const last = useStore((s) => s.lastPos)
  const [open, setOpen] = useState<string | null>(null)
  if (!idx) return <div className="loading">Cargando la Biblia…</div>
  const groups: { t: string; g: string; books: BookInfo[] }[] = []
  for (const b of idx) {
    let g = groups.find((x) => x.g === b.group && x.t === b.testament)
    if (!g) groups.push((g = { t: b.testament, g: b.group, books: [] }))
    g.books.push(b)
  }
  return (
    <div className="page">
      <header className="page-head">
        <h1>Sagrada Biblia</h1>
        <p className="subtitle">Versión de Mons. Juan Straubinger, con sus comentarios</p>
        <div className="row gap">
          {last && (
            <Link className="btn primary" to={`/biblia/${last.book}/${last.chapter}`}>
              Continuar: {idx.find((b) => b.id === last.book)?.name} {last.chapter}
            </Link>
          )}
          <Link className="btn" to="/buscar">
            🔍 Buscar en la Biblia
          </Link>
          <Link className="btn" to="/planes">
            📅 Planes de lectura
          </Link>
        </div>
      </header>
      {(['AT', 'NT'] as const).map((t) => (
        <section key={t}>
          <h2 className="testament">{t === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}</h2>
          {groups
            .filter((g) => g.t === t)
            .map((g) => (
              <div key={g.g} className="book-group">
                <h3>{g.g}</h3>
                <div className="book-grid">
                  {g.books.map((b) => {
                    const done = b.chapters.filter((c) => read[chapterKey(b.id, c.c)]).length
                    const pct = done / b.chapters.length
                    return (
                      <div key={b.id} className={'book-card' + (open === b.id ? ' open' : '')}>
                        <button className="book-btn" onClick={() => setOpen(open === b.id ? null : b.id)}>
                          <span className="book-name">{b.name}</span>
                          <span className="book-meta">
                            {done}/{b.chapters.length}
                          </span>
                          <span className="book-bar" style={{ width: `${pct * 100}%` }} />
                        </button>
                        {open === b.id && (
                          <div className="ch-grid">
                            {b.chapters.map((c) => (
                              <Link
                                key={c.c}
                                to={`/biblia/${b.id}/${c.c}`}
                                className={'ch' + (read[chapterKey(b.id, c.c)] ? ' done' : '')}
                                title={c.alt ? `(${c.alt})` : undefined}
                              >
                                {c.c}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
        </section>
      ))}
    </div>
  )
}

/** Lector de capítulos */
export function Reader() {
  const { book = 'gn', chapter = '1' } = useParams()
  const c = parseInt(chapter)
  const [params] = useSearchParams()
  const targetV = params.get('v') ? parseInt(params.get('v')!) : null
  const idx = useIndex()
  const [data, setData] = useState<Book | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const read = useStore((s) => s.read)
  const setRead = useStore((s) => s.setRead)
  const setLastPos = useStore((s) => s.setLastPos)
  const bookmarks = useStore((s) => s.bookmarks)
  const toggleBookmark = useStore((s) => s.toggleBookmark)
  const [selected, setSelected] = useState<number[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const nav = useNavigate()
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setData(null)
    setErr(null)
    loadBook(book)
      .then(setData)
      .catch((e) => setErr(String(e)))
  }, [book])
  useEffect(() => {
    setSelected([])
    setLastPos(book, c)
    if (!targetV) window.scrollTo({ top: 0 })
  }, [book, c, setLastPos, targetV])
  useEffect(() => {
    if (data && targetV) {
      setTimeout(() => {
        const el = document.getElementById(`v${targetV}`)
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        el?.classList.add('flash')
        setTimeout(() => el?.classList.remove('flash'), 2400)
      }, 80)
    }
  }, [data, targetV, c])

  const info = idx?.find((b) => b.id === book)
  const ch = data?.chapters.find((x) => x.c === c)
  const chIdx = info?.chapters.findIndex((x) => x.c === c) ?? -1
  const bookIdx = idx?.findIndex((b) => b.id === book) ?? -1
  const prev = useMemo(() => {
    if (!idx || !info) return null
    if (chIdx > 0) return { b: book, c: info.chapters[chIdx - 1].c }
    const pb = idx[bookIdx - 1]
    return pb ? { b: pb.id, c: pb.chapters[pb.chapters.length - 1].c } : null
  }, [idx, info, chIdx, bookIdx, book])
  const next = useMemo(() => {
    if (!idx || !info) return null
    if (chIdx < info.chapters.length - 1) return { b: book, c: info.chapters[chIdx + 1].c }
    const nb = idx[bookIdx + 1]
    return nb ? { b: nb.id, c: nb.chapters[0].c } : null
  }, [idx, info, chIdx, bookIdx, book])

  const places = usePlaces()
  const chapterPlaces = useMemo(() => {
    if (!places) return []
    return places.filter((p) => p.r.some(([b, cc]) => b === book && (book === 'sal' ? hebrewToVulgatePsalm(cc) : cc) === c)).slice(0, 30)
  }, [places, book, c])

  if (err) return <div className="page">Error: {err}</div>
  if (!data || !info) return <div className="loading">Cargando…</div>
  if (!ch) return <div className="page">Capítulo no encontrado.</div>

  const key = chapterKey(book, c)
  const isRead = !!read[key]
  const label = (v: number) => `${info.abbr} ${c},${v}`
  const chapterLabel = `${info.name} ${c}${ch.alt ? ` (${ch.alt})` : ''}`
  const isBookmarked = bookmarks.some((b) => b.ref === key)
  const allNotes = ch.v.filter((v) => v.f?.length)

  return (
    <div className={`reader theme-${settings.theme}`} style={{ ['--fs' as string]: `${settings.fontSize}px` }} ref={topRef}>
      <div className="reader-bar">
        <button className="icon-btn" onClick={() => nav('/biblia')} title="Libros">
          ☰
        </button>
        <select className="sel" value={book} onChange={(e) => nav(`/biblia/${e.target.value}/${idx!.find((b) => b.id === e.target.value)!.chapters[0].c}`)}>
          {idx!.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select className="sel small" value={c} onChange={(e) => nav(`/biblia/${book}/${e.target.value}`)}>
          {info.chapters.map((x) => (
            <option key={x.c} value={x.c}>
              {x.c}
            </option>
          ))}
        </select>
        <span className="spacer" />
        <button className={'icon-btn' + (isBookmarked ? ' on' : '')} title="Marcador" onClick={() => toggleBookmark(key, chapterLabel)}>
          {isBookmarked ? '🔖' : '🏷️'}
        </button>
        <button className="icon-btn" title="Apariencia" onClick={() => setShowSettings(!showSettings)}>
          Aa
        </button>
      </div>
      {showSettings && (
        <div className="reader-settings">
          <label>
            Tamaño
            <input type="range" min={14} max={28} value={settings.fontSize} onChange={(e) => setSettings({ fontSize: +e.target.value })} />
          </label>
          <div className="seg">
            {(['claro', 'sepia', 'oscuro'] as const).map((t) => (
              <button key={t} className={settings.theme === t ? 'on' : ''} onClick={() => setSettings({ theme: t })}>
                {t}
              </button>
            ))}
          </div>
          <label className="chk">
            <input type="checkbox" checked={settings.showNotes} onChange={(e) => setSettings({ showNotes: e.target.checked })} /> Notas de Straubinger
          </label>
          <label className="chk">
            <input type="checkbox" checked={settings.showHeadings} onChange={(e) => setSettings({ showHeadings: e.target.checked })} /> Títulos
          </label>
        </div>
      )}

      <article className="chapter">
        <h1 className="chapter-title">
          <span className="bk">{info.name}</span>
          <span className="cn">{c}</span>
          {ch.alt && <span className="alt">Hebreo: {ch.alt}</span>}
        </h1>
        {c === info.chapters[0].c && data.intro && (
          <details className="intro">
            <summary>Introducción de Mons. Straubinger al libro</summary>
            <div dangerouslySetInnerHTML={{ __html: data.intro }} />
          </details>
        )}
        <Annotator className="verses">
          {groupParas(ch.v).map((para, pi) => (
            <div key={pi} className="para-wrap">
              {para[0].h && settings.showHeadings && <h4 className="pericope">{para[0].h}</h4>}
              <p className={'para' + (para.some((v) => v.t.includes('\n')) ? ' poetry' : '')}>
                {para.map((v) => (
                  <VerseView
                    key={v.n}
                    v={v}
                    book={book}
                    c={c}
                    label={label(v.n)}
                    showNotes={settings.showNotes}
                    selected={selected.includes(v.n)}
                    onToggle={() => setSelected((s) => (s.includes(v.n) ? s.filter((x) => x !== v.n) : [...s, v.n]))}
                  />
                ))}
              </p>
            </div>
          ))}
        </Annotator>

        {chapterPlaces.length > 0 && (
          <div className="places-chips">
            <span>📍 Lugares en este capítulo:</span>
            {chapterPlaces.map((p) => (
              <Link key={p.id} to={`/mapa?lugar=${p.id}`} className="chip">
                {placeName(p)}
              </Link>
            ))}
          </div>
        )}

        <div className="chapter-end">
          <button className={'btn big ' + (isRead ? 'done' : 'primary')} onClick={() => setRead(key, !isRead)}>
            {isRead ? '✓ Capítulo leído' : 'Marcar capítulo como leído'}
          </button>
          {!isRead && <p className="hint">Cada capítulo leído hace crecer tu jardín de ciudades bíblicas 🌱</p>}
        </div>

        {allNotes.length > 0 && settings.showNotes && (
          <details className="all-notes">
            <summary>📜 Comentarios de Mons. Straubinger a este capítulo ({allNotes.reduce((a, v) => a + v.f!.length, 0)})</summary>
            {allNotes.map((v) =>
              v.f!.map((n, i) => (
                <p key={v.n + '-' + i} className="straub-note">
                  <a href={`#v${v.n}`} className="vref">
                    v. {v.n}
                  </a>{' '}
                  <span dangerouslySetInnerHTML={{ __html: n }} />
                </p>
              )),
            )}
          </details>
        )}

        <nav className="chapter-nav">
          {prev ? (
            <Link className="btn" to={`/biblia/${prev.b}/${prev.c}`}>
              ← Anterior
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              className="btn primary"
              to={`/biblia/${next.b}/${next.c}`}
              onClick={() => {
                if (!isRead) setRead(key, true)
              }}
            >
              {isRead ? 'Siguiente →' : 'Leído y siguiente →'}
            </Link>
          )}
        </nav>
        <p className="credit">
          Texto: Sagrada Biblia, versión de Mons. Juan Straubinger, según la edición digital de{' '}
          <a href="https://bibliastraubinger.com/" target="_blank" rel="noreferrer">
            bibliastraubinger.com
          </a>
          .
        </p>
      </article>
      {selected.length > 0 && <VerseActions book={book} c={c} abbr={info.abbr} verses={ch.v.filter((v) => selected.includes(v.n))} onClose={() => setSelected([])} />}
    </div>
  )
}

function groupParas(vs: Verse[]): Verse[][] {
  const out: Verse[][] = []
  for (const v of vs) {
    if (!out.length || v.p || v.h) out.push([v])
    else out[out.length - 1].push(v)
  }
  return out
}

function VerseView({
  v,
  book,
  c,
  label,
  showNotes,
  selected,
  onToggle,
}: {
  v: Verse
  book: string
  c: number
  label: string
  showNotes: boolean
  selected: boolean
  onToggle: () => void
}) {
  const openDrawer = useUI((s) => s.openDrawer)
  const ref = verseRef(book, c, v.n)
  return (
    <span
      id={`v${v.n}`}
      className={'verse' + (selected ? ' selected' : '')}
      onClick={() => {
        const s = window.getSelection()
        if (s && !s.isCollapsed) return
        onToggle()
      }}
    >
      <sup className="vnum">{v.n}</sup>
      <StudyText refId={ref} html={v.t} label={label} />
      {showNotes && v.f && (
        <button
          className="fn-btn"
          title="Comentario de Straubinger"
          onClick={(e) => {
            e.stopPropagation()
            openDrawer({ type: 'straub', label, notes: v.f! })
          }}
        >
          ✠
        </button>
      )}
      <NoteBadge refId={ref} label={label} />{' '}
    </span>
  )
}

function VerseActions({ book, c, abbr, verses, onClose }: { book: string; c: number; abbr: string; verses: Verse[]; onClose: () => void }) {
  const apply = useStore((s) => s.applyHighlight)
  const openEditor = useUI((s) => s.openEditor)
  const openDrawer = useUI((s) => s.openDrawer)
  const toast = useUI((s) => s.showToast)
  const sorted = [...verses].sort((a, b) => a.n - b.n)
  const label = `${abbr} ${c},${sorted.length === 1 ? sorted[0].n : sorted.map((v) => v.n).join('.')}`
  const color = (col: ColorId | null) => {
    sorted.forEach((v) => apply(verseRef(book, c, v.n), 0, plain(v.t).length, col))
    onClose()
  }
  const notes = sorted.flatMap((v) => v.f || [])
  return (
    <div className="verse-actions">
      <div className="va-label">{label}</div>
      <div className="va-row">
        {COLORS.map((cc) => (
          <button key={cc.id} className="swatch" style={{ background: cc.hex }} onClick={() => color(cc.id)} />
        ))}
        <button className="tb-btn" onClick={() => color(null)} title="Quitar">
          ⌫
        </button>
      </div>
      <div className="va-row">
        <button
          className="tb-btn"
          onClick={() => {
            openEditor({ ref: verseRef(book, c, sorted[0].n), label, quote: sorted.map((v) => plain(v.t)).join(' '), text: '' })
            onClose()
          }}
        >
          💬 Comentar
        </button>
        {notes.length > 0 && (
          <button className="tb-btn" onClick={() => openDrawer({ type: 'straub', label, notes })}>
            ✠ Notas
          </button>
        )}
        <button
          className="tb-btn"
          onClick={() => {
            navigator.clipboard?.writeText(`${sorted.map((v) => plain(v.t).replace(/\n/g, ' ')).join(' ')} (${label})`)
            toast('Versículos copiados')
            onClose()
          }}
        >
          ⧉ Copiar
        </button>
        <button className="tb-btn" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}
