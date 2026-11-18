import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GardenScene } from '../three/garden'
import { useCities, levelOf } from '../lib/progress'
import { useStore } from '../lib/store'
import { Progress } from '../components/Common'
import './garden.css'

export default function Jardin() {
  const ref = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<GardenScene | null>(null)
  const cities = useCities()
  const seen = useStore((s) => s.gardenSeen)
  const setSeen = useStore((s) => s.setGardenSeen)
  const [params, setParams] = useSearchParams()
  const selected = params.get('ciudad')
  const [preview, setPreview] = useState(false)
  const [list, setList] = useState(false)

  const setParamsRef = useRef(setParams)
  setParamsRef.current = setParams
  const levelsRef = useRef<Record<string, number> | null>(null)
  useEffect(() => {
    const g = new GardenScene(ref.current!, (id) => setParamsRef.current(id ? { ciudad: id } : {}, { replace: true }))
    sceneRef.current = g
    if (levelsRef.current) g.setLevels(levelsRef.current, {})
    return () => g.dispose()
  }, [])

  const levels = useMemo(() => {
    if (!cities) return null
    return Object.fromEntries(cities.map((c) => [c.city.id, preview ? 5 : levelOf(c.pct)]))
  }, [cities, preview])

  useEffect(() => {
    levelsRef.current = levels
    if (!levels || !sceneRef.current) return
    sceneRef.current.setLevels(levels, preview ? {} : seen)
    if (!preview) Object.entries(levels).forEach(([id, l]) => (seen[id] ?? 0) !== l && setSeen(id, l))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levels])

  useEffect(() => {
    sceneRef.current?.focus(selected)
  }, [selected])
  useEffect(() => {
    if (selected) setTimeout(() => sceneRef.current?.focus(selected), 50)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sel = cities?.find((c) => c.city.id === selected)
  const totalLvl = cities ? cities.reduce((a, c) => a + levelOf(c.pct), 0) : 0

  return (
    <div className="garden">
      <div className="garden-canvas" ref={ref} />
      <div className="garden-top">
        <div className="garden-title">
          <h1>Jardín de las ciudades bíblicas</h1>
          <div className="muted">
            {totalLvl}/{(cities?.length || 15) * 5} etapas construidas · lee para edificar
          </div>
        </div>
        <div className="row gap wrap">
          <button className="btn" onClick={() => setList(!list)}>
            🏙️ Ciudades
          </button>
          <label className="btn">
            <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} /> Vista previa completa
          </label>
          {selected && (
            <button className="btn" onClick={() => setParams({}, { replace: true })}>
              🔭 Vista general
            </button>
          )}
        </div>
      </div>
      {list && cities && (
        <div className="garden-list">
          {cities.map((c, i) => (
            <button
              key={c.city.id}
              className={'gl-item' + (c.city.id === selected ? ' on' : '')}
              onClick={() => {
                setParams({ ciudad: c.city.id }, { replace: true })
                setList(false)
              }}
            >
              <span className="gl-n">{i + 1}</span>
              <span className="gl-name">{c.city.name}</span>
              <span className="gl-stars">{'★'.repeat(levelOf(c.pct))}</span>
            </button>
          ))}
        </div>
      )}
      {sel && (
        <aside className="garden-panel">
          <button className="drawer-close" onClick={() => setParams({}, { replace: true })}>
            ✕
          </button>
          <div className="kicker">{sel.city.subtitle}</div>
          <h2>{sel.city.name}</h2>
          <Link to={`/biblia/${sel.city.verseRef}`} className="gp-verse">
            {sel.city.verse}
          </Link>
          <p>{sel.city.desc}</p>
          <Progress value={sel.done} total={sel.total} />
          <ol className="gp-stages">
            {sel.city.stages.map((s, k) => {
              const lvl = levelOf(sel.pct)
              return (
                <li key={k} className={k < lvl ? 'done' : ''}>
                  <span>{k < lvl ? '✓' : `${[1, 25, 50, 75, 100][k]}%`}</span> {s}
                </li>
              )
            })}
          </ol>
          <h3>Qué leer</h3>
          <div className="gp-reqs">
            {sel.parts.map((p) => (
              <Link key={p.label} to={p.link} className={'gp-req' + (p.done === p.total ? ' done' : '')}>
                <span>{p.label}</span>
                <span className="muted small">
                  {p.done}/{p.total}
                </span>
                <span className="gp-bar" style={{ width: `${(p.done / p.total) * 100}%` }} />
              </Link>
            ))}
          </div>
        </aside>
      )}
      {!selected && <div className="garden-hint">Toca una ciudad para ver qué la construye · arrastra para girar · rueda o pellizca para acercar</div>}
    </div>
  )
}
