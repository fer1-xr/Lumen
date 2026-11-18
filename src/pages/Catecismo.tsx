import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CIC, CIC_PARTS, cicUrl, loadCicText, type CicPara } from '../data/catecismo'
import { useStore } from '../lib/store'
import { Annotator } from '../components/Annotator'
import { NoteBadge, StudyText } from '../components/StudyText'
import { BibleCite, Progress, ReadToggle } from '../components/Common'

export function CatecismoHome() {
  const read = useStore((s) => s.read)
  const done = CIC.filter((u) => read['cic:' + u.id]).length
  return (
    <div className="page">
      <header className="page-head">
        <h1>Catecismo de la Iglesia Católica</h1>
        <p className="subtitle">
          Texto íntegro, número por número, con resumen, ideas clave y textos bíblicos para el estudio.
        </p>
        <Progress value={done} total={CIC.length} />
      </header>
      {CIC_PARTS.map((p) => {
        const units = CIC.filter((u) => u.part === p.n)
        const d = units.filter((u) => read['cic:' + u.id]).length
        let lastSection = ''
        return (
          <section key={p.n} className="cic-part">
            <h2>
              <span className="part-icon">{p.icon}</span> {p.n > 0 ? `${['', 'Primera', 'Segunda', 'Tercera', 'Cuarta'][p.n]} parte: ` : ''}
              {p.title}
            </h2>
            <p className="muted">{p.desc}</p>
            <Progress value={d} total={units.length} small />
            <div className="unit-list">
              {units.map((u) => {
                const showSec = u.section !== lastSection && p.n > 0
                lastSection = u.section
                return (
                  <div key={u.id}>
                    {showSec && <h4 className="sec-title">{u.section}</h4>}
                    <Link to={`/catecismo/${u.id}`} className={'unit' + (read['cic:' + u.id] ? ' done' : '')}>
                      <span className="unit-check">{read['cic:' + u.id] ? '✓' : ''}</span>
                      <span className="unit-title">{u.title}</span>
                      <span className="unit-range">
                        §{u.range[0]}–{u.range[1]}
                      </span>
                    </Link>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export function CatecismoUnit() {
  const { id = '' } = useParams()
  const i = CIC.findIndex((u) => u.id === id)
  const u = CIC[i]
  if (!u) return <div className="page">Unidad no encontrada.</div>
  const prev = CIC[i - 1]
  const next = CIC[i + 1]
  const part = CIC_PARTS.find((p) => p.n === u.part)!
  const ref = (k: string) => `cic:${u.id}:${k}`
  return (
    <div className="page doc">
      <Link to="/catecismo" className="back">
        ← Catecismo
      </Link>
      <div className="doc-kicker">
        {part.icon} {part.title} · {u.section}
        {u.chapter ? ` · ${u.chapter}` : ''}
      </div>
      <h1>{u.title}</h1>
      <div className="doc-meta">
        Números §{u.range[0]}–{u.range[1]} ·{' '}
        <a href={cicUrl(u.id)} target="_blank" rel="noreferrer">
          Leer el texto oficial en vatican.va ↗
        </a>
      </div>
      <Annotator className="doc-body">
        <h3>Resumen para el estudio</h3>
        <p>
          <StudyText refId={ref('s')} html={u.summary} label={`CEC ${u.range[0]}–${u.range[1]}`} />
          <NoteBadge refId={ref('s')} label={u.title} />
        </p>
        {u.key.length > 0 && (
          <>
            <h3>Ideas clave</h3>
            <ul className="keys">
              {u.key.map((k, j) => (
                <li key={j}>
                  <StudyText refId={ref('k' + j)} html={k} label={`CEC ${u.range[0]}–${u.range[1]}`} />
                  <NoteBadge refId={ref('k' + j)} label={u.title} />
                </li>
              ))}
            </ul>
          </>
        )}
      </Annotator>
      <FullText id={u.id} />
      {u.bible && u.bible.length > 0 && (
        <div className="doc-bible">
          <h3>📖 En la Sagrada Escritura</h3>
          <div className="row gap wrap">
            {u.bible.map((b) => (
              <BibleCite key={b} text={b} />
            ))}
          </div>
        </div>
      )}
      <div className="doc-actions">
        <ReadToggle k={'cic:' + u.id} />
        <p className="hint">Cada unidad estudiada levanta la Ciudad del Vaticano en tu jardín 🏛️</p>
      </div>
      <nav className="chapter-nav">
        {prev ? (
          <Link className="btn" to={`/catecismo/${prev.id}`}>
            ← {prev.title.slice(0, 40)}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link className="btn primary" to={`/catecismo/${next.id}`}>
            {next.title.slice(0, 40)} →
          </Link>
        )}
      </nav>
    </div>
  )
}

function FullText({ id }: { id: string }) {
  const [state, setState] = useState<{ id: string; paras?: CicPara[]; err?: boolean }>({ id })
  useEffect(() => {
    let alive = true
    loadCicText(id).then(
      (paras) => alive && setState({ id, paras }),
      () => alive && setState({ id, err: true }),
    )
    return () => {
      alive = false
    }
  }, [id])
  const cur = state.id === id ? state : { id }
  return (
    <section className="cic-full">
      <h2>Texto íntegro</h2>
      {cur.err && <p className="muted">No se pudo cargar el texto. Revisa tu conexión.</p>}
      {!cur.paras && !cur.err && <p className="muted">Cargando…</p>}
      {cur.paras && (
        <Annotator className="doc-body cic-text">
          {cur.paras.map((p) => (
            <div key={p.n} id={'n' + p.n}>
              {p.h?.map((h, j) => (
                <h4 key={j} className="cic-h">
                  {h}
                </h4>
              ))}
              {p.b.map((b, j) => {
                const refId = `cic:n${p.n}:${j}`
                const label = `CEC ${p.n}`
                const body = (
                  <p className="cic-p">
                    {j === 0 && <b className="cic-n">{p.n}</b>}
                    <StudyText refId={refId} html={b.t} label={label} />
                    <NoteBadge refId={refId} label={label} />
                  </p>
                )
                return b.q ? <blockquote key={j}>{body}</blockquote> : <div key={j}>{body}</div>
              })}
            </div>
          ))}
          <p className="muted small">
            Texto oficial © Libreria Editrice Vaticana, tomado de{' '}
            <a href={cicUrl(id)} target="_blank" rel="noreferrer">
              vatican.va
            </a>
            .
          </p>
        </Annotator>
      )}
    </section>
  )
}
