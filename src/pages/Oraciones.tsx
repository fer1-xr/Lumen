import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CONCILIOS, MISTERIOS, ORACIONES, misterioDelDia } from '../data/oraciones'
import { Annotator } from '../components/Annotator'
import { NoteBadge, StudyText } from '../components/StudyText'

export function Oraciones() {
  const hoy = misterioDelDia()
  const [m, setM] = useState(hoy.name)
  const { hash } = useLocation()
  useEffect(() => {
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [hash])
  const mist = MISTERIOS.find((x) => x.name === m)!
  const groups = [...new Set(ORACIONES.map((o) => o.group))]
  return (
    <div className="page">
      <header className="page-head">
        <h1>Oraciones y Santo Rosario</h1>
        <p className="subtitle">Las oraciones de siempre de la Iglesia. También puedes resaltarlas y comentarlas.</p>
      </header>

      <section className="rosary">
        <h2>📿 Santo Rosario</h2>
        <p className="muted">
          Hoy se rezan los misterios <strong>{hoy.name.toLowerCase()}</strong> ({hoy.days}).
        </p>
        <div className="seg">
          {MISTERIOS.map((x) => (
            <button key={x.name} className={m === x.name ? 'on' : ''} onClick={() => setM(x.name)}>
              {x.name}
            </button>
          ))}
        </div>
        <ol className="mysteries">
          {mist.items.map((it, i) => (
            <li key={i}>
              <span className="mnum">{i + 1}º</span>
              <span>{it.title}</span>
              <Link className="cite" to={`/biblia/${it.ref}`}>
                {it.cita}
              </Link>
            </li>
          ))}
        </ol>
        <p className="muted small">
          Cada misterio: un Padre Nuestro, diez Avemarías y un Gloria. Al final, la Salve.
        </p>
      </section>

      <Annotator>
        {groups.map((g) => (
          <section key={g}>
            <h2>{g}</h2>
            <div className="prayer-grid">
              {ORACIONES.filter((o) => o.group === g).map((o) => (
                <article key={o.id} id={o.id} className="prayer">
                  <h3>{o.title}</h3>
                  <p className="prayer-text">
                    <StudyText refId={`ora:${o.id}:0`} html={o.text} label={o.title} />
                    <NoteBadge refId={`ora:${o.id}:0`} label={o.title} />
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </Annotator>

      <section>
        <h2>⛪ Los 21 concilios ecuménicos</h2>
        <div className="councils">
          {CONCILIOS.map((c) => (
            <div key={c.n} className="council">
              <div className="council-n">{c.n}</div>
              <div>
                <strong>{c.name}</strong> <span className="muted">({c.year})</span>
                <div className="small">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
