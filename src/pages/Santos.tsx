import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SANTOS, fechaFiesta, santoDelDia } from '../data/santos'
import { useStore } from '../lib/store'
import { Annotator } from '../components/Annotator'
import { NoteBadge, StudyText } from '../components/StudyText'
import { Progress, ReadToggle } from '../components/Common'
import { normalize } from '../lib/bible'

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

export function SantoView() {
  const { id = '' } = useParams()
  const s = SANTOS.find((x) => x.id === id)
  if (!s) return <div className="page">No encontrado.</div>
  const ref = (k: string) => `san:${s.id}:${k}`
  return (
    <div className="page doc">
      <Link to="/santos" className="back">
        ← Santos
      </Link>
      <div className="saint-hero">
        <span className="emoji big">{s.emoji}</span>
        <div>
          <div className="doc-kicker">
            Fiesta: {fechaFiesta(s.feast)} · {s.life} · {s.region}
          </div>
          <h1>{s.name}</h1>
          <p className="doc-theme">{s.patron}</p>
        </div>
      </div>
      <Annotator className="doc-body">
        {s.bio.map((p, i) => (
          <p key={i}>
            <StudyText refId={ref('b' + i)} html={p} label={s.name} />
            <NoteBadge refId={ref('b' + i)} label={s.name} />
          </p>
        ))}
        {s.quote && (
          <blockquote className="saint-quote">
            <StudyText refId={ref('q')} html={s.quote} label={s.name} />
          </blockquote>
        )}
        <div className="lesson">
          <strong>Para mi vida: </strong>
          <StudyText refId={ref('l')} html={s.lesson} label={s.name} />
        </div>
      </Annotator>
      <div className="doc-actions">
        <ReadToggle k={'san:' + s.id} label="Marcar como leída" labelDone="Leída ✓" />
        <p className="hint">Cada vida de santo que leas construye la ciudad de Asís en tu jardín ⛪</p>
      </div>
    </div>
  )
}
