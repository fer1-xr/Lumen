import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapScene, ROUTES, type RegionId } from '../three/map3d'
import { usePlaces, placeAlt, type Place } from '../lib/places'
import { hebrewToVulgatePsalm, normalize, bookNames } from '../lib/bible'
import { useIndex } from './Bible'
import './garden.css'

const TS = { lon0: 33.6, lon1: 37.2, lat0: 29.3, lat1: 33.8 }
const inTS = (p: Place) => p.lon >= TS.lon0 && p.lon <= TS.lon1 && p.lat >= TS.lat0 && p.lat <= TS.lat1
const KIND = { land: 'Ciudad / lugar', water: 'Río, mar o fuente', region: 'Región / territorio' }

export default function Mapa() {
  const ref = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<MapScene | null>(null)
  const places = usePlaces()
  const idx = useIndex()
  const [params, setParams] = useSearchParams()
  const selected = params.get('lugar')
  const [region, setRegion] = useState<RegionId>('tierrasanta')
  const [q, setQ] = useState('')
  const [book, setBook] = useState('')
  const [routes, setRoutes] = useState<string[]>([])
  const [showRoutes, setShowRoutes] = useState(false)
  const [hover, setHover] = useState<{ p: Place; x: number; y: number } | null>(null)

  const setParamsRef = useRef(setParams)
  setParamsRef.current = setParams
  useEffect(() => {
    const m = new MapScene(
      ref.current!,
      (id) => setParamsRef.current(id ? { lugar: id } : {}, { replace: true }),
      (p, x, y) => setHover(p ? { p, x, y } : null),
    )
    sceneRef.current = m
    return () => m.dispose()
  }, [])

  useEffect(() => {
    if (places) sceneRef.current?.setPlaces(places)
  }, [places])

  // si el lugar elegido está fuera de la región visible, cambia de región
  const sel = places?.find((p) => p.id === selected) || null
  useEffect(() => {
    if (sel) {
      const want: RegionId = inTS(sel) ? 'tierrasanta' : 'mundo'
      if (want !== region) setRegion(want)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel?.id])

  useEffect(() => {
    const m = sceneRef.current
    if (!m) return
    m.setRegion(region).then(() => {
      m.setRoutes(routes)
      m.select(selected)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region])

  useEffect(() => {
    sceneRef.current?.select(selected)
  }, [selected])

  useEffect(() => {
    sceneRef.current?.setFilter(book ? (p) => p.r.some((r) => r[0] === book) : null)
  }, [book])

  useEffect(() => {
    sceneRef.current?.setRoutes(routes)
  }, [routes])

  const suggestions = useMemo(() => {
    if (!places || q.trim().length < 2) return []
    const n = normalize(q)
    return places
      .filter((p) => normalize(p.es).includes(n) || normalize(p.en).includes(n))
      .sort((a, b) => b.r.length - a.r.length)
      .slice(0, 12)
  }, [places, q])

  const refsByBook = useMemo(() => {
    if (!sel) return []
    const m = new Map<string, { c: number; v: number }[]>()
    for (const [b, c, v] of sel.r) {
      const cc = b === 'sal' ? hebrewToVulgatePsalm(c) : c
      if (!m.has(b)) m.set(b, [])
      m.get(b)!.push({ c: cc, v })
    }
    const order = idx ? Object.fromEntries(idx.map((b, i) => [b.id, i])) : {}
    return [...m.entries()].sort((a, b) => (order[a[0]] ?? 0) - (order[b[0]] ?? 0))
  }, [sel, idx])

  const regionRoutes = ROUTES.filter((r) => r.region === region)

  return (
    <div className="map3d">
      <div className="map-canvas" ref={ref} />
      <div className="map-top">
        <div className="map-title">
          <h1>Mapa bíblico 3D</h1>
          <div className="muted small">{places ? `${places.length} lugares geolocalizados` : 'Cargando lugares…'}</div>
        </div>
        <div className="map-controls">
          <div className="seg">
            <button className={region === 'tierrasanta' ? 'on' : ''} onClick={() => setRegion('tierrasanta')}>
              Tierra Santa
            </button>
            <button className={region === 'mundo' ? 'on' : ''} onClick={() => setRegion('mundo')}>
              Mundo bíblico
            </button>
          </div>
          <div className="map-search">
            <input className="input" placeholder="🔍 Buscar lugar (Belén, Nínive, Éfeso…)" value={q} onChange={(e) => setQ(e.target.value)} />
            {suggestions.length > 0 && (
              <div className="map-suggest">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setParams({ lugar: p.id }, { replace: true })
                      setQ('')
                    }}
                  >
                    <strong>{p.es}</strong> <span className="muted small">· {p.r.length} citas</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <select className="sel" value={book} onChange={(e) => setBook(e.target.value)}>
            <option value="">Lugares de toda la Biblia</option>
            {idx?.map((b) => (
              <option key={b.id} value={b.id}>
                Solo en {b.name}
              </option>
            ))}
          </select>
          <button className="btn" onClick={() => setShowRoutes(!showRoutes)}>
            🧭 Rutas
          </button>
          <button className="btn" onClick={() => sceneRef.current?.resetView()}>
            ⟲
          </button>
        </div>
      </div>
      {showRoutes && (
        <div className="garden-list" style={{ top: 140 }}>
          <div className="small muted" style={{ padding: '6px 10px' }}>
            Rutas en {region === 'mundo' ? 'el mundo bíblico' : 'Tierra Santa'}:
          </div>
          {regionRoutes.map((r) => (
            <label key={r.id} className="gl-item">
              <input type="checkbox" checked={routes.includes(r.id)} onChange={(e) => setRoutes(e.target.checked ? [...routes, r.id] : routes.filter((x) => x !== r.id))} />
              <span className="dot" style={{ background: r.color }} />
              <span className="gl-name">{r.name}</span>
            </label>
          ))}
          <div className="small muted" style={{ padding: '6px 10px' }}>
            {region === 'mundo' ? 'El Éxodo y la vida de Jesús están en «Tierra Santa».' : 'Abraham y San Pablo están en «Mundo bíblico».'}
          </div>
        </div>
      )}
      {hover && !sel && (
        <div className="map-tooltip" style={{ left: hover.x, top: hover.y }}>
          {hover.p.es} · {hover.p.r.length} citas
        </div>
      )}
      {sel && (
        <aside className="map-panel">
          <button className="drawer-close" onClick={() => setParams({}, { replace: true })}>
            ✕
          </button>
          <div className="kicker">{KIND[sel.k]}</div>
          <h2>{sel.es}</h2>
          <div className="muted small">
            {sel.en !== sel.es && <>Nombre en los datos: {sel.en}. </>}
            {placeAlt(sel) && <>({placeAlt(sel)}) </>}
            {sel.lat.toFixed(3)}°N, {sel.lon.toFixed(3)}°E
          </div>
          <p>
            Mencionado en <strong>{sel.r.length}</strong> versículo{sel.r.length === 1 ? '' : 's'}.
          </p>
          <div className="refs">
            {refsByBook.map(([b, list]) => (
              <div key={b} style={{ marginBottom: 10 }}>
                <div className="small" style={{ fontWeight: 700 }}>
                  {bookNames[b]?.name || b}
                </div>
                <div className="refs-list">
                  {list.slice(0, 40).map((r, i) => (
                    <Link key={i} className="chip" to={`/biblia/${b}/${r.c}?v=${r.v}`}>
                      {r.c},{r.v}
                    </Link>
                  ))}
                  {list.length > 40 && <span className="muted small">+{list.length - 40} más</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="muted small">Coordenadas: identificación más probable según OpenBible.info (CC BY).</p>
        </aside>
      )}
      <div className="legend">
        <div>
          <i style={{ background: '#b3261e' }} /> Ciudades y lugares
        </div>
        <div>
          <i style={{ background: '#1f6fb2' }} /> Ríos, mares, fuentes
        </div>
        <div>
          <i style={{ background: '#6b5a48' }} /> Regiones
        </div>
        <div className="muted">Relieve exagerado · Datos: Mapzen/AWS Terrain, Natural Earth</div>
      </div>
    </div>
  )
}
