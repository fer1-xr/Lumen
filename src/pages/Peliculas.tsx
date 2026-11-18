import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PELICULAS, isFile, poster, previewSrc, toEmbed, type Pelicula } from '../data/peliculas'
import { useMedia } from '../lib/media'
import { useStore } from '../lib/store'
import { normalize } from '../lib/bible'
import { ReadToggle } from '../components/Common'

function useAll() {
  const mine = useMedia((s) => s.myFilms)
  return [...PELICULAS, ...mine]
}

export function PeliculasHome() {
  const all = useAll()
  const read = useStore((s) => s.read)
  const addFilm = useMedia((s) => s.addFilm)
  const [q, setQ] = useState('')
  const [tag, setTag] = useState('')
  const [adding, setAdding] = useState(false)
  const [prev, setPrev] = useState<Pelicula | null>(null)
  const nav = useNavigate()
  const [form, setForm] = useState({ title: '', url: '', year: '', synopsis: '' })
  const tags = [...new Set(all.flatMap((p) => p.tags))].sort()
  const list = all.filter((p) => (!tag || p.tags.includes(tag)) && (!q || normalize(p.title + (p.original || '') + p.director + p.synopsis).includes(normalize(q))))
  const embed = toEmbed(form.url)
  const save = () => {
    if (!form.title || !embed) return
    addFilm({
      id: 'u' + Date.now().toString(36), title: form.title, year: +form.year || new Date().getFullYear(), director: '—', tags: ['Mis películas'],
      synopsis: form.synopsis || 'Añadida por mí.', src: embed, source: new URL(form.url).hostname, custom: true,
    })
    setForm({ title: '', url: '', year: '', synopsis: '' })
    setAdding(false)
  }
  return (
    <div className="page">
      <header className="page-head">
        <h1>Películas católicas</h1>
        <p className="subtitle">Cine clásico de fe para ver dentro de Lumen. Clásicos de dominio público (Internet Archive) y películas de santos publicadas en YouTube. Toca una para ver la previsualización.</p>
      </header>
      <div className="row gap wrap filters">
        <input className="input" placeholder="Buscar película, director…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={tag} onChange={(e) => setTag(e.target.value)} style={{ maxWidth: 220 }}>
          <option value="">Todas las categorías</option>
          {tags.map((t) => <option key={t}>{t}</option>)}
        </select>
        <button className="btn primary" onClick={() => setAdding(!adding)}>＋ Añadir película</button>
      </div>
      {adding && (
        <div className="card add-form">
          <p className="muted">Pega un enlace de YouTube, Internet Archive, Vimeo o un archivo .mp4. Se guarda sólo en este dispositivo.</p>
          <input className="input" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="https://www.youtube.com/watch?v=…" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <div className="row gap">
            <input className="input" placeholder="Año" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={{ maxWidth: 110 }} />
            <input className="input" placeholder="Sinopsis (opcional)" value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} />
          </div>
          {form.url && !embed && <p className="danger-text">Enlace no reconocido.</p>}
          <button className="btn primary" disabled={!form.title || !embed} onClick={save}>Guardar</button>
        </div>
      )}
      <div className="film-grid">
        {list.map((p) => (
          <button key={p.id} onClick={() => setPrev(p)} className={'film-card' + (read['film:' + p.id] ? ' done' : '')}>
            <div className="film-poster">
              {poster(p) && <img src={poster(p)!} alt="" loading="lazy" />}
              {p.year > 0 && <span className="film-year">{p.year}</span>}
              <span className="film-play">▶</span>
              <span className="film-ptitle">{p.title}</span>
            </div>
            <div className="film-body">
              <div className="saint-name">{p.title}</div>
              <div className="saint-meta">{p.original && p.original !== p.title ? p.original + ' · ' : ''}{p.director}{p.minutes ? ` · ${p.minutes} min` : ''}</div>
              <div className="chips">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            </div>
            {read['film:' + p.id] && <span className="ok corner">✓</span>}
          </button>
        ))}
      </div>
      {!list.length && <p className="muted">No hay resultados.</p>}
      {prev && (
        <div className="lightbox film-preview-bg" onClick={() => setPrev(null)}>
          <div className="film-preview" onClick={(e) => e.stopPropagation()}>
            <div className="video-frame">
              {previewSrc(prev) ? (
                <iframe src={previewSrc(prev)!} title="Previsualización" allow="autoplay; encrypted-media" />
              ) : poster(prev) ? (
                <img className="preview-img" src={poster(prev)!} alt={prev.title} />
              ) : null}
              <span className="preview-badge">Previsualización</span>
            </div>
            <div className="film-preview-body">
              <div className="doc-kicker">{prev.year > 0 ? prev.year + ' · ' : ''}{prev.director}{prev.minutes ? ` · ${prev.minutes} min` : ''} · {prev.source}</div>
              <h2>{prev.title}</h2>
              <p>{prev.synopsis}</p>
              <div className="chips">{prev.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              <div className="row gap" style={{ marginTop: 14 }}>
                <button className="btn primary big" onClick={() => nav(`/peliculas/${prev.id}`)}>▶ Ver película</button>
                <button className="btn" onClick={() => setPrev(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function PeliculaView() {
  const { id = '' } = useParams()
  const all = useAll()
  const removeFilm = useMedia((s) => s.removeFilm)
  const p: Pelicula | undefined = all.find((x) => x.id === id)
  if (!p) return <div className="page">No encontrada. <Link to="/peliculas">Volver</Link></div>
  const related = all.filter((x) => x.id !== p.id && x.tags.some((t) => p.tags.includes(t))).slice(0, 4)
  return (
    <div className="page wide">
      <Link to="/peliculas" className="back">← Películas</Link>
      <div className="video-frame">
        {isFile(p.src) ? (
          <video src={p.src} controls playsInline />
        ) : (
          <iframe src={p.src} title={p.title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        )}
      </div>
      <div className="doc-kicker">{p.year > 0 ? p.year + ' · ' : ''}{p.director}{p.minutes ? ` · ${p.minutes} min` : ''} · Fuente: {p.source}</div>
      <h1>{p.title}</h1>
      {p.original && p.original !== p.title && <p className="doc-theme">{p.original}</p>}
      <p className="lead">{p.synopsis}</p>
      <div className="chips">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
      <div className="doc-actions">
        <ReadToggle k={'film:' + p.id} label="Marcar como vista" labelDone="Vista ✓" />
        {p.custom && <button className="btn danger" onClick={() => { removeFilm(p.id); history.back() }}>Quitar de mi lista</button>}
      </div>
      {related.length > 0 && (
        <>
          <h2>También te puede gustar</h2>
          <div className="row gap wrap">
            {related.map((r) => <Link key={r.id} to={`/peliculas/${r.id}`} className="chip big">🎬 {r.title}{r.year > 0 ? ` (${r.year})` : ''}</Link>)}
          </div>
        </>
      )}
    </div>
  )
}
