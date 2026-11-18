import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Annotator } from '../components/Annotator'
import { NoteBadge, StudyText } from '../components/StudyText'
import { Progress, ReadToggle } from '../components/Common'
import { ENC_CAT, LANGS, LEGACY, VATICAN, fmtDate, fold, loadVatDoc, useVatIndex, type Block } from '../lib/vaticano'

const PAGE = 60

export function EnciclicasHome() {
  const read = useStore((s) => s.read)
  const { idx, error } = useVatIndex()
  const [params, setParams] = useSearchParams()
  const cat = +(params.get('t') ?? ENC_CAT)
  const pope = params.get('p') ?? ''
  const q = params.get('q') ?? ''
  const onlyEs = params.get('es') === '1'
  const [shown, setShown] = useState(PAGE)
  useEffect(() => setShown(PAGE), [cat, pope, q, onlyEs])
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(params)
    if (v) n.set(k, v)
    else n.delete(k)
    setParams(n, { replace: true })
  }

  const counts = useMemo(() => {
    const c: number[] = []
    idx?.docs.forEach((d) => (!pope || d.pope === +pope) && (c[d.cat] = (c[d.cat] || 0) + 1))
    return c
  }, [idx, pope])

  const list = useMemo(() => {
    if (!idx) return []
    const words = fold(q).split(/\s+/).filter(Boolean)
    return idx.docs.filter(
      (d) =>
        (cat < 0 || d.cat === cat) &&
        (!pope || d.pope === +pope) &&
        (!onlyEs || d.lang === 'es') &&
        (!words.length || words.every((w) => fold(d.title).includes(w))),
    )
  }, [idx, cat, pope, q, onlyEs])

  if (error) return <div className="page">No se pudieron cargar los documentos. Revisa tu conexión.</div>
  if (!idx) return <div className="page">Cargando documentos pontificios…</div>

  const encs = idx.docs.filter((d) => d.cat === ENC_CAT)
  const encDone = encs.filter((d) => read['enc:' + d.id]).length
  return (
    <div className="page">
      <header className="page-head">
        <h1>Documentos pontificios</h1>
        <p className="subtitle">
          De León XIII a León XIV: {idx.docs.length.toLocaleString('es')} documentos completos de vatican.va — encíclicas, exhortaciones, cartas apostólicas,
          constituciones, motu proprio, bulas, breves, cartas, discursos, mensajes, homilías y más.
        </p>
        <Progress value={encDone} total={encs.length} />
        <p className="hint">Encíclicas estudiadas</p>
        <div className="chips">
          {idx.cats.map(([, label], i) =>
            counts[i] ? (
              <button key={i} className={'chip' + (cat === i ? ' on' : '')} onClick={() => set('t', String(i))}>
                {label} <span className="chip-n">{counts[i].toLocaleString('es')}</span>
              </button>
            ) : null,
          )}
          <button className={'chip' + (cat < 0 ? ' on' : '')} onClick={() => set('t', '-1')}>
            Todos
          </button>
        </div>
        <div className="row gap wrap filters">
          <select className="sel" value={pope} onChange={(e) => set('p', e.target.value)}>
            <option value="">Todos los papas</option>
            {idx.popes.map(([, name], i) => (
              <option key={i} value={i}>
                {name}
              </option>
            ))}
          </select>
          <input className="sel" type="search" placeholder="Buscar por título…" value={q} onChange={(e) => set('q', e.target.value)} />
          <label className="row gap">
            <input type="checkbox" checked={onlyEs} onChange={(e) => set('es', e.target.checked ? '1' : '')} /> Solo en español
          </label>
        </div>
        <p className="hint">{list.length.toLocaleString('es')} documentos</p>
      </header>
      <div className="timeline">
        {list.slice(0, shown).map((d) => (
          <Link key={d.id} to={`/enciclicas/${d.id}`} className={'tl-item' + (read['enc:' + d.id] ? ' done' : '')}>
            <div className="tl-year">{d.date.slice(0, 4)}</div>
            <div className="tl-body">
              <div className="tl-title">
                {d.title} {read['enc:' + d.id] && <span className="ok">✓</span>}
              </div>
              <div className="tl-meta">
                {idx.popes[d.pope][1]} · <span className="tag">{idx.cats[d.cat][1]}</span>
                {d.lang !== 'es' && <span className="tag">{LANGS[d.lang] || d.lang}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {shown < list.length && (
        <div className="doc-actions">
          <button className="btn" onClick={() => setShown(shown + PAGE * 2)}>
            Ver más ({(list.length - shown).toLocaleString('es')} restantes)
          </button>
        </div>
      )}
    </div>
  )
}

const KIND: Record<string, 'p' | 'div'> = { p: 'p', c: 'p', r: 'p', q: 'p', h: 'div' }

export function EnciclicaView() {
  const { id: rawId = '' } = useParams()
  const id = LEGACY[rawId] || rawId
  const { idx, error } = useVatIndex()
  const [blocks, setBlocks] = useState<Block[] | null>(null)
  const [fail, setFail] = useState(false)
  useEffect(() => {
    let alive = true
    setBlocks(null)
    setFail(false)
    loadVatDoc(id).then((b) => alive && setBlocks(b), () => alive && setFail(true))
    window.scrollTo(0, 0)
    return () => {
      alive = false
    }
  }, [id])

  const d = idx?.byId.get(id)
  const siblings = useMemo(() => (idx && d ? idx.docs.filter((x) => x.cat === d.cat && x.pope === d.pope) : []), [idx, d])
  if (error || (idx && !d)) return <div className="page">Documento no encontrado.</div>
  if (!idx || !d) return <div className="page">Cargando…</div>
  const pos = siblings.findIndex((x) => x.id === d.id)
  const prev = siblings[pos - 1]
  const next = siblings[pos + 1]
  const ref = (n: number) => `enc:${d.id}:${n}`
  const catLabel = idx.cats[d.cat][1]
  return (
    <div className="page doc">
      <Link to={`/enciclicas?t=${d.cat}`} className="back">
        ← {catLabel}
      </Link>
      <div className="doc-kicker">
        {catLabel} · {idx.popes[d.pope][1]} {d.date && '· ' + fmtDate(d.date)}
      </div>
      <h1>{d.title}</h1>
      <div className="doc-meta">
        {d.lang !== 'es' && <span className="tag">Texto en {(LANGS[d.lang] || d.lang).toLowerCase()} (vatican.va no ofrece versión en español)</span>}{' '}
        <a href={VATICAN + d.src} target="_blank" rel="noreferrer">
          Ver en vatican.va ↗
        </a>
        {d.words > 0 && <span className="hint"> · {Math.max(1, Math.round(d.words / 220))} min de lectura</span>}
      </div>
      {fail && <p>No se pudo cargar el texto. Revisa tu conexión.</p>}
      {!blocks && !fail && <p className="hint">Cargando texto completo…</p>}
      {blocks && (
        <Annotator className="doc-body vat-text">
          {blocks.map(([k, html], n) => {
            const Tag = KIND[k] || 'p'
            return (
              <Tag key={n} className={'vb-' + k}>
                <StudyText refId={ref(n)} html={html} label={d.title} />
                <NoteBadge refId={ref(n)} label={d.title} />
              </Tag>
            )
          })}
        </Annotator>
      )}
      <div className="doc-actions">
        <ReadToggle k={'enc:' + d.id} label="Marcar como leído" labelDone="Leído ✓" />
        {d.cat === ENC_CAT && <p className="hint">Cada encíclica que leas hará crecer la Ciudad del Vaticano 🏛️</p>}
        <div className="row gap wrap">
          {prev && (
            <Link className="btn" to={`/enciclicas/${prev.id}`}>
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link className="btn" to={`/enciclicas/${next.id}`}>
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
