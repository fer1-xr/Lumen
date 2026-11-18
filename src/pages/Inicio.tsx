import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadBook, bookNames, loadIndex } from '../lib/bible'
import { plain } from '../lib/rich'
import { useStore } from '../lib/store'
import { useCities, useTotals, levelOf } from '../lib/progress'
import { santoDelDia, fechaFiesta } from '../data/santos'
import { misterioDelDia } from '../data/oraciones'
import { Progress } from '../components/Common'

const VERSOS: [string, number, number][] = [
  ['jn', 3, 16], ['sal', 22, 1], ['flp', 4, 13], ['is', 40, 31], ['mt', 11, 28], ['rm', 8, 28], ['jr', 29, 11], ['pr', 3, 5], ['1co', 13, 4],
  ['jn', 14, 6], ['mt', 6, 33], ['sal', 26, 1], ['is', 41, 10], ['2co', 12, 9], ['ga', 2, 20], ['jn', 15, 5], ['mt', 5, 3], ['lc', 1, 38],
  ['1jn', 4, 8], ['rm', 12, 2], ['ef', 2, 8], ['hb', 11, 1], ['st', 1, 5], ['1p', 5, 7], ['sal', 118, 105], ['jn', 1, 14], ['ap', 21, 5],
  ['mt', 28, 20], ['lc', 6, 36], ['jn', 11, 25], ['sal', 45, 11], ['is', 43, 1], ['mi', 6, 8], ['lm', 3, 22], ['sof', 3, 17], ['mc', 10, 27],
  ['jn', 8, 32], ['rm', 5, 8], ['col', 3, 23], ['1ts', 5, 16], ['jn', 13, 34], ['mt', 7, 7], ['dt', 6, 5], ['gn', 1, 1], ['ex', 3, 14],
]

function useVerseOfDay() {
  const [v, setV] = useState<{ text: string; ref: string; to: string } | null>(null)
  useEffect(() => {
    const start = new Date(new Date().getFullYear(), 0, 0).getTime()
    const doy = Math.floor((Date.now() - start) / 86400000)
    const list = VERSOS.filter((x) => x[0] !== 'sof')
    const [b, c, n] = list[doy % list.length]
    Promise.all([loadBook(b), loadIndex()]).then(([book]) => {
      const verse = book.chapters.find((x) => x.c === c)?.v.find((x) => x.n === n)
      if (verse) setV({ text: plain(verse.t).replace(/\n/g, ' '), ref: `${bookNames[b]?.abbr || b} ${c},${n}`, to: `/biblia/${b}/${c}?v=${n}` })
    })
  }, [])
  return v
}

export function Inicio() {
  const last = useStore((s) => s.lastPos)
  const v = useVerseOfDay()
  const santo = santoDelDia()
  const mist = misterioDelDia()
  const totals = useTotals()
  const cities = useCities()
  const hl = useStore((s) => s.highlights.length)
  const notes = useStore((s) => s.notes.length)
  const hour = new Date().getHours()
  const saludo = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'
  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-text">
          <div className="kicker">{saludo} · {new Date().toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          <h1>«Lámpara es tu palabra para mis pasos»</h1>
          <p className="muted">Salmo 118,105</p>
          <div className="row gap wrap">
            <Link className="btn primary big" to={last ? `/biblia/${last.book}/${last.chapter}` : '/biblia/gn/1'}>
              {last ? `Continuar: ${bookNames[last.book]?.name || ''} ${last.chapter}` : 'Comenzar a leer'}
            </Link>
            <Link className="btn big" to="/jardin">
              🌳 Mi jardín
            </Link>
          </div>
        </div>
      </section>

      <div className="home-grid">
        {v && (
          <Link to={v.to} className="card verse-day">
            <div className="kicker">Versículo del día</div>
            <p className="vd-text">«{v.text}»</p>
            <div className="vd-ref">{v.ref}</div>
          </Link>
        )}
        <Link to={`/santos/${santo.id}`} className="card">
          <div className="kicker">Santo del día · {fechaFiesta(santo.feast)}</div>
          <div className="card-big">
            {santo.emoji} {santo.name}
          </div>
          <p className="muted">{santo.lesson}</p>
        </Link>
        <Link to="/oraciones" className="card">
          <div className="kicker">Santo Rosario de hoy</div>
          <div className="card-big">📿 Misterios {mist.name.toLowerCase()}</div>
          <p className="muted">{mist.items.map((i) => i.title).slice(0, 2).join(' · ')}…</p>
        </Link>
      </div>

      <section>
        <h2>Tu camino</h2>
        <div className="stats-grid">
          <Link to="/biblia" className="stat">
            <span className="stat-icon">📖</span>
            <span className="stat-label">Biblia</span>
            <Progress value={totals.bible} total={totals.bibleTotal} />
          </Link>
          <Link to="/catecismo" className="stat">
            <span className="stat-icon">✝️</span>
            <span className="stat-label">Catecismo</span>
            <Progress value={totals.cic} total={totals.cicTotal} />
          </Link>
          <Link to="/enciclicas" className="stat">
            <span className="stat-icon">📜</span>
            <span className="stat-label">Encíclicas</span>
            <Progress value={totals.enc} total={totals.encTotal} />
          </Link>
          <Link to="/santos" className="stat">
            <span className="stat-icon">😇</span>
            <span className="stat-label">Santos</span>
            <Progress value={totals.san} total={totals.sanTotal} />
          </Link>
          <Link to="/estudio" className="stat">
            <span className="stat-icon">🖍️</span>
            <span className="stat-label">Resaltados y notas</span>
            <span className="stat-num">
              {hl} resaltados · {notes} comentarios
            </span>
          </Link>
          <Link to="/mapa" className="stat">
            <span className="stat-icon">🗺️</span>
            <span className="stat-label">Mapa 3D</span>
            <span className="stat-num">Más de 1.300 lugares bíblicos</span>
          </Link>
        </div>
      </section>

      {cities && (
        <section>
          <div className="row between">
            <h2>Tu jardín de ciudades</h2>
            <Link to="/jardin">Ver en 3D →</Link>
          </div>
          <div className="city-strip">
            {cities.map(({ city, pct }) => {
              const lvl = levelOf(pct)
              return (
                <Link key={city.id} to={`/jardin?ciudad=${city.id}`} className={'city-pill lvl' + lvl}>
                  <span className="cp-name">{city.name}</span>
                  <span className="cp-stars">{'★'.repeat(lvl)}{'☆'.repeat(5 - lvl)}</span>
                  <span className="cp-bar" style={{ width: `${pct * 100}%` }} />
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
