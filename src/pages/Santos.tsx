import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SANTOS, fechaFiesta, santoDelDia } from '../data/santos'
import { useStore } from '../lib/store'
import { Annotator } from '../components/Annotator'
import { NoteBadge, StudyText } from '../components/StudyText'
import { Progress, ReadToggle } from '../components/Common'
import { normalize } from '../lib/bible'
import { SaintFlag, flagColors } from '../components/SaintFlag'
import { fetchCommons, fetchWiki, type CommonsImg, type WikiInfo } from '../lib/wiki'
import { useMedia } from '../lib/media'
import { PELICULAS, toEmbed } from '../data/peliculas'

export function SantosHome() {
  const read = useStore((s) => s.read)
  const [q, setQ] = useState('')
  const [order, setOrder] = useState<'cal' | 'hist'>('cal')
  const hoy = santoDelDia()
  const list = SANTOS.filter((s) => !q || normalize(s.name + s.patron + s.region).includes(normalize(q))).sort((a, b) =>
    order === 'cal' ? a.feast.localeCompare(b.feast) : parseInt(a.life.replace(/\D+/, '') || '0') - parseInt(b.life.replace(/\D+/, '') || '0'),
  )
  const done = SANTOS.filter((s) => read['san:' + s.id]).length
  return (
    <div className="page">
      <header className="page-head">
        <h1>Vidas de santos</h1>
        <p className="subtitle">Amigos de Dios que nos muestran que la santidad es posible en todo tiempo y lugar.</p>
        <Progress value={done} total={SANTOS.length} />
      </header>
      <Link to={`/santos/${hoy.id}`} className="saint-today">
        <span className="emoji">{hoy.emoji}</span>
        <div>
          <div className="kicker">Santo del día · {fechaFiesta(hoy.feast)}</div>
          <div className="title">{hoy.name}</div>
          <div className="muted">{hoy.lesson}</div>
        </div>
      </Link>
      <div className="row gap wrap filters">
        <input className="input" placeholder="Buscar santo, patronazgo, país…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="seg">
          <button className={order === 'cal' ? 'on' : ''} onClick={() => setOrder('cal')}>
            Calendario
          </button>
          <button className={order === 'hist' ? 'on' : ''} onClick={() => setOrder('hist')}>
            Historia
          </button>
        </div>
      </div>
      <div className="saint-grid">
        {list.map((s) => (
          <Link key={s.id} to={`/santos/${s.id}`} className={'saint-card' + (read['san:' + s.id] ? ' done' : '')}>
            <span className="emoji">{s.emoji}</span>
            <div className="saint-name">{s.name}</div>
            <div className="saint-meta">
              {fechaFiesta(s.feast)} · {s.life}
            </div>
            <div className="saint-patron">{s.patron}</div>
            {read['san:' + s.id] && <span className="ok corner">✓</span>}
          </Link>
        ))}
      </div>
    </div>
  )
}

interface Leaf {
  key: string
  title: string
  body: ReactNode
}

/** Reparte párrafos en hojas de un tamaño legible */
function paginate(paras: string[], max = 1700) {
  const pages: string[][] = []
  let cur: string[] = []
  let len = 0
  for (const p of paras) {
    if (len && len + p.length > max) {
      pages.push(cur)
      cur = []
      len = 0
    }
    cur.push(p)
    len += p.length
  }
  if (cur.length) pages.push(cur)
  return pages
}

const clean = (n: string) => n.replace(/\s*\(.*?\)/g, '')
const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`

export function SantoView() {
  const { id = '' } = useParams()
  const s = SANTOS.find((x) => x.id === id)
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const [wiki, setWiki] = useState<WikiInfo | null | undefined>(undefined)
  const [imgs, setImgs] = useState<CommonsImg[] | null>(null)
  const [lightbox, setLightbox] = useState<CommonsImg | null>(null)
  const [vid, setVid] = useState('')
  const videos = useMedia((st) => (s ? st.saintVideos[s.id] : undefined))
  const addVideo = useMedia((st) => st.addSaintVideo)
  const removeVideo = useMedia((st) => st.removeSaintVideo)
  const touch = useRef<number | null>(null)

  const [tries, setTries] = useState(0)
  useEffect(() => {
    if (!s) return
    setWiki(undefined)
    setImgs(null)
    const name = clean(s.name)
    const bare = name.replace(/^(San|Santa|Santo|Santísima)\s+/, '')
    fetchWiki(name).then(setWiki, () => setWiki(null))
    fetchCommons(bare + ' painting').then(
      (r) => (r.length >= 6 ? setImgs(r) : fetchCommons(bare).then((r2) => setImgs([...r, ...r2.filter((x) => !r.some((y) => y.full === x.full))].slice(0, 12)), () => setImgs(r))),
      () => setImgs([]),
    )
  }, [s, tries])
  useEffect(() => setPage(0), [s])

  const leaves: Leaf[] = useMemo(() => {
    if (!s) return []
    const ref = (k: string) => `san:${s.id}:${k}`
    const T = ({ k, html }: { k: string; html: string }) => (
      <p key={k}>
        <StudyText refId={ref(k)} html={html} label={s.name} />
        <NoteBadge refId={ref(k)} label={s.name} />
      </p>
    )
    const [c1] = flagColors(s)
    const films = PELICULAS.filter((f) => normalize(f.title + f.synopsis + f.tags.join(' ')).includes(normalize(clean(s.name).split(' ').slice(-2).join(' '))))
    const L: Leaf[] = [
      {
        key: 'portada', title: 'Portada',
        body: (
          <div className="book-cover" style={{ background: `linear-gradient(160deg, ${c1}, #1b1416)` }}>
            <div className="cover-frame">
              <div className="cover-kicker">Vida de</div>
              <h1>{s.name}</h1>
              <SaintFlag s={s} size={170} />
              <div className="cover-feast">Fiesta: {fechaFiesta(s.feast)}</div>
              <div className="cover-sub">{s.patron}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'origen', title: 'Origen y nacimiento',
        body: (
          <>
            <dl className="facts">
              <dt>Lugar</dt><dd>{s.region}</dd>
              <dt>Vida</dt><dd>{s.life}</dd>
              <dt>Fiesta</dt><dd>{fechaFiesta(s.feast)}</dd>
              <dt>Patronazgo</dt><dd>{s.patron}</dd>
              {wiki?.title && <><dt>En Wikipedia</dt><dd><a href={wiki.url} target="_blank" rel="noreferrer">{wiki.title} ↗</a></dd></>}
            </dl>
            {wiki?.image && <img className="book-portrait" src={wiki.image} alt={s.name} loading="lazy" />}
            {T({ k: 'b0', html: s.bio[0] })}
          </>
        ),
      },
      {
        key: 'historia', title: 'Su historia',
        body: <>{s.bio.slice(1).map((p, i) => T({ k: 'b' + (i + 1), html: p }))}{s.bio.length < 2 && <p className="muted">Continúa en las páginas siguientes.</p>}</>,
      },
    ]
    if (wiki === undefined) L.push({ key: 'w-load', title: 'Historia completa', body: <p className="muted">Cargando la historia completa…</p> })
    else if (wiki)
      wiki.sections.forEach((sec, si) =>
        paginate(sec.paras).forEach((chunk, ci) =>
          L.push({
            key: `w${si}-${ci}`,
            title: `Historia completa · ${sec.heading}${ci ? ' (cont.)' : ''}`,
            body: <>{chunk.map((p) => T({ k: `w${si}-${sec.paras.indexOf(p)}`, html: p }))}<p className="src">Fuente: Wikipedia (CC BY-SA)</p></>,
          }),
        ),
      )
    else L.push({ key: 'w-none', title: 'Historia completa', body: <><p className="muted">No se pudo cargar la historia ampliada (¿sin conexión?).</p><button className="btn" onClick={() => setTries((t) => t + 1)}>Reintentar</button></> })
    L.push(
      {
        key: 'bandera', title: 'Estandarte del santo',
        body: (
          <div className="flag-page">
            <SaintFlag s={s} size={300} />
            <p className="muted">
              Estandarte devocional de Lumen: el emblema {s.emoji} recuerda su vida; los colores siguen la tradición litúrgica
              {c1 === '#8c2b20' ? ' (rojo de los mártires)' : c1 === '#1f3d6b' ? ' (azul y blanco marianos)' : ''}; el lema resume su enseñanza.
            </p>
          </div>
        ),
      },
      {
        key: 'frase', title: 'Frase de cabecera',
        body: (
          <div className="quote-page">
            <span className="big-q">“</span>
            <blockquote className="saint-quote big"><StudyText refId={ref('q')} html={s.quote || s.lesson} label={s.name} /></blockquote>
            <div className="muted">— {s.name}</div>
          </div>
        ),
      },
      {
        key: 'galeria', title: 'Imágenes y pinturas',
        body: imgs === null ? <p className="muted">Buscando obras de arte…</p> : imgs.length ? (
          <>
            <div className="gallery">
              {imgs.map((im) => (
                <button key={im.full} className="gal-item" onClick={() => setLightbox(im)}>
                  <img src={im.thumb} alt={im.title} loading="lazy" />
                </button>
              ))}
            </div>
            <p className="src">Imágenes de Wikimedia Commons · toca para ampliar</p>
          </>
        ) : <><p className="muted">No se encontraron imágenes.</p><button className="btn" onClick={() => setTries((t) => t + 1)}>Reintentar</button></>,
      },
      {
        key: 'videos', title: 'Videos y documentales',
        body: (
          <>
            <ul className="link-list">
              <li><a href={yt(`documental ${clean(s.name)}`)} target="_blank" rel="noreferrer">🎞️ Documentales sobre {clean(s.name)} ↗</a></li>
              <li><a href={yt(`película ${clean(s.name)}`)} target="_blank" rel="noreferrer">🎬 Películas sobre su vida ↗</a></li>
              <li><a href={yt(`vida de ${clean(s.name)} santo`)} target="_blank" rel="noreferrer">▶️ Biografías en video ↗</a></li>
              <li><a href={`https://archive.org/search?query=${encodeURIComponent(clean(s.name).replace(/^(San|Santa|Santo)\s+/, ''))}&mediatype=movies`} target="_blank" rel="noreferrer">🏛️ Archivo audiovisual (Internet Archive) ↗</a></li>
              {wiki && <li><a href={wiki.url} target="_blank" rel="noreferrer">📚 Artículo completo en Wikipedia ↗</a></li>}
              {films.map((f) => <li key={f.id}><Link to={`/peliculas/${f.id}`}>🎥 Ver en Lumen: {f.title} ({f.year})</Link></li>)}
            </ul>
            {(videos || []).map((u) => (
              <div key={u} className="video-frame small">
                <iframe src={u} title="Video" allowFullScreen allow="fullscreen; picture-in-picture" />
                <button className="btn ghost" onClick={() => removeVideo(s.id, u)}>Quitar video</button>
              </div>
            ))}
            <div className="row gap">
              <input className="input" placeholder="Pega un enlace de YouTube para guardarlo aquí" value={vid} onChange={(e) => setVid(e.target.value)} />
              <button className="btn primary" disabled={!toEmbed(vid)} onClick={() => { addVideo(s.id, toEmbed(vid)!); setVid('') }}>Añadir</button>
            </div>
          </>
        ),
      },
      {
        key: 'vida', title: 'Para mi vida',
        body: (
          <>
            <div className="lesson"><strong>Para mi vida: </strong><StudyText refId={ref('l')} html={s.lesson} label={s.name} /></div>
            <p className="muted">Selecciona cualquier texto del libro para resaltarlo o añadir una nota. Todo queda en «Resaltados y notas».</p>
            <div className="doc-actions">
              <ReadToggle k={'san:' + s.id} label="Marcar como leída" labelDone="Leída ✓" />
              <p className="hint">Cada vida de santo que leas construye la ciudad de Asís en tu jardín ⛪</p>
            </div>
          </>
        ),
      },
    )
    return L
  }, [s, wiki, imgs, videos, vid, addVideo, removeVideo])

  const n = leaves.length
  const go = (p: number) => {
    const t = Math.max(0, Math.min(n - 1, p))
    if (t === page) return
    setDir(t > page ? 1 : -1)
    setPage(t)
    window.getSelection()?.removeAllRanges()
  }
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea')) return
      if (e.key === 'ArrowRight') go(page + 1)
      if (e.key === 'ArrowLeft') go(page - 1)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  })

  if (!s) return <div className="page">No encontrado.</div>
  const leaf = leaves[Math.min(page, n - 1)]
  return (
    <div className="page book-page">
      <Link to="/santos" className="back">← Santos</Link>
      <div className="book-toolbar">
        <select className="input" value={page} onChange={(e) => go(+e.target.value)}>
          {leaves.map((l, i) => <option key={l.key} value={i}>{i + 1}. {l.title}</option>)}
        </select>
      </div>
      <div className="book">
        <button className="book-nav prev" onClick={() => go(page - 1)} disabled={page === 0} aria-label="Página anterior">‹</button>
        <div
          className="book-sheet"
          onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touch.current === null) return
            const dx = e.changedTouches[0].clientX - touch.current
            touch.current = null
            if (Math.abs(dx) > 70 && !window.getSelection()?.toString()) go(page + (dx < 0 ? 1 : -1))
          }}
        >
          <div key={leaf.key} className={'leaf ' + (dir > 0 ? 'in-right' : 'in-left') + (leaf.key === 'portada' ? ' cover' : '')}>
            {leaf.key !== 'portada' && <div className="leaf-head">{leaf.title}</div>}
            <Annotator className="leaf-body doc-body">{leaf.body}</Annotator>
            <div className="leaf-foot">{s.name} · {page + 1} / {n}</div>
          </div>
        </div>
        <button className="book-nav next" onClick={() => go(page + 1)} disabled={page >= n - 1} aria-label="Página siguiente">›</button>
      </div>
      {n <= 40 && <div className="book-dots">
        {leaves.map((l, i) => <button key={l.key} className={i === page ? 'on' : ''} onClick={() => go(i)} title={l.title} />)}
      </div>}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox.full} alt={lightbox.title} />
          <div className="lb-cap">
            {lightbox.title}{lightbox.artist ? ' · ' + lightbox.artist : ''} · <a href={lightbox.page} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Commons ↗</a>
          </div>
        </div>
      )}
    </div>
  )
}
