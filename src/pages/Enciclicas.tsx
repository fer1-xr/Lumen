import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ENCICLICAS, POPES, TOPICS } from '../data/enciclicas'
import { useStore } from '../lib/store'
import { Annotator } from '../components/Annotator'
import { NoteBadge, StudyText } from '../components/StudyText'
import { Progress, ReadToggle } from '../components/Common'

const fmt = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })

export function EnciclicasHome() {
  const read = useStore((s) => s.read)
  const [pope, setPope] = useState('')
  const [topic, setTopic] = useState('')
  const list = ENCICLICAS.filter((e) => (!pope || e.pope === pope) && (!topic || e.topic === topic))
  const done = ENCICLICAS.filter((e) => read['enc:' + e.id]).length
  return (
    <div className="page">
      <header className="page-head">
        <h1>Encíclicas papales</h1>
        <p className="subtitle">De León XIII a León XIV: guías de estudio con enlace al texto completo en vatican.va.</p>
        <Progress value={done} total={ENCICLICAS.length} />
        <div className="row gap wrap filters">
          <select className="sel" value={pope} onChange={(e) => setPope(e.target.value)}>
            <option value="">Todos los papas</option>
            {POPES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select className="sel" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">Todos los temas</option>
            {TOPICS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
      </header>
      <div className="timeline">
        {list.map((e) => (
          <Link key={e.id} to={`/enciclicas/${e.id}`} className={'tl-item' + (read['enc:' + e.id] ? ' done' : '')}>
            <div className="tl-year">{e.date.slice(0, 4)}</div>
            <div className="tl-body">
              <div className="tl-title">
                {e.title} {read['enc:' + e.id] && <span className="ok">✓</span>}
              </div>
              <div className="tl-sub">{e.theme}</div>
              <div className="tl-meta">
                {e.pope} · <span className="tag">{e.topic}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function EnciclicaView() {
  const { id = '' } = useParams()
  const e = ENCICLICAS.find((x) => x.id === id)
  if (!e) return <div className="page">No encontrada.</div>
  const ref = (k: string) => `enc:${e.id}:${k}`
  return (
    <div className="page doc">
      <Link to="/enciclicas" className="back">
        ← Encíclicas
      </Link>
      <div className="doc-kicker">
        Carta encíclica · {e.pope} · {fmt(e.date)}
      </div>
      <h1>{e.title}</h1>
      <p className="doc-theme">{e.theme}</p>
      <div className="doc-meta">
        <span className="tag">{e.topic}</span> ·{' '}
        <a href={e.url} target="_blank" rel="noreferrer">
          Leer la encíclica completa en vatican.va ↗
        </a>
      </div>
      <Annotator className="doc-body">
        <h3>Síntesis</h3>
        <p>
          <StudyText refId={ref('s')} html={e.summary} label={e.title} />
          <NoteBadge refId={ref('s')} label={e.title} />
        </p>
        <h3>Ideas clave</h3>
        <ul className="keys">
          {e.key.map((k, j) => (
            <li key={j}>
              <StudyText refId={ref('k' + j)} html={k} label={e.title} />
              <NoteBadge refId={ref('k' + j)} label={e.title} />
            </li>
          ))}
        </ul>
      </Annotator>
      <div className="doc-actions">
        <ReadToggle k={'enc:' + e.id} label="Marcar como leída" labelDone="Leída ✓" />
        <p className="hint">Lee la encíclica completa y márcala: hará crecer la Ciudad del Vaticano 🏛️</p>
      </div>
    </div>
  )
}
