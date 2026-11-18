import { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { BibleHome, Reader } from './pages/Bible'
import { Inicio } from './pages/Inicio'
import { CatecismoHome, CatecismoUnit } from './pages/Catecismo'
import { EnciclicasHome, EnciclicaView } from './pages/Enciclicas'
import { SantosHome, SantoView } from './pages/Santos'
import { Oraciones } from './pages/Oraciones'
import { Planes } from './pages/Planes'
import { Buscar } from './pages/Buscar'
import { Estudio } from './pages/Estudio'
import { Overlays } from './components/Overlays'
import { Player } from './components/Player'
import { PeliculasHome, PeliculaView } from './pages/Peliculas'
import { Musica } from './pages/Musica'
import { useStore } from './lib/store'

const Jardin = lazy(() => import('./pages/Jardin'))
const Mapa = lazy(() => import('./pages/Mapa'))

const NAV = [
  { to: '/', label: 'Inicio', icon: '🏠', end: true },
  { to: '/biblia', label: 'Biblia', icon: '📖' },
  { to: '/estudio', label: 'Resaltados y notas', icon: '🖍️' },
  { to: '/catecismo', label: 'Catecismo', icon: '✝️' },
  { to: '/enciclicas', label: 'Documentos pontificios', icon: '📜' },
  { to: '/santos', label: 'Santos', icon: '😇' },
  { to: '/peliculas', label: 'Películas', icon: '🎬' },
  { to: '/musica', label: 'Música sacra', icon: '🎼' },
  { to: '/oraciones', label: 'Oraciones', icon: '📿' },
  { to: '/planes', label: 'Planes', icon: '📅' },
  { to: '/jardin', label: 'Jardín', icon: '🌳' },
  { to: '/mapa', label: 'Mapa 3D', icon: '🗺️' },
]

function Shell() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const theme = useStore((s) => s.settings.theme)
  const setSettings = useStore((s) => s.setSettings)
  const dark = theme === 'oscuro'
  const toggleDark = () => setSettings({ theme: dark ? 'claro' : 'oscuro' })
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  const full = loc.pathname.startsWith('/jardin') || loc.pathname.startsWith('/mapa')
  return (
    <div className={'shell' + (full ? ' full' : '')}>
      <aside className={'sidebar' + (open ? ' open' : '')}>
        <NavLink to="/" className="brand">
          <span className="brand-mark">✠</span>
          <span>
            <span className="brand-name">Lumen</span>
            <span className="brand-sub">Estudio católico</span>
          </span>
        </NavLink>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="nav-item">
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button className="nav-item theme-toggle" onClick={toggleDark}>
          <span className="nav-icon">{dark ? '☀️' : '🌙'}</span>
          {dark ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <div className="sidebar-foot">
          Texto bíblico: Mons. J. Straubinger · Lugares: OpenBible.info (CC BY)
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <header className="topbar">
        <button className="icon-btn" onClick={() => setOpen(true)} aria-label="Menú">
          ☰
        </button>
        <NavLink to="/" className="brand small">
          <span className="brand-mark">✠</span> Lumen
        </NavLink>
        <button className="icon-btn" onClick={toggleDark} aria-label={dark ? 'Modo claro' : 'Modo oscuro'}>
          {dark ? '☀️' : '🌙'}
        </button>
        <NavLink to="/buscar" className="icon-btn" aria-label="Buscar">
          🔍
        </NavLink>
      </header>
      <main className="main">
        <Suspense fallback={<div className="loading">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/biblia" element={<BibleHome />} />
            <Route path="/biblia/:book/:chapter" element={<Reader />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/catecismo" element={<CatecismoHome />} />
            <Route path="/catecismo/:id" element={<CatecismoUnit />} />
            <Route path="/enciclicas" element={<EnciclicasHome />} />
            <Route path="/enciclicas/:id" element={<EnciclicaView />} />
            <Route path="/santos" element={<SantosHome />} />
            <Route path="/santos/:id" element={<SantoView />} />
            <Route path="/peliculas" element={<PeliculasHome />} />
            <Route path="/peliculas/:id" element={<PeliculaView />} />
            <Route path="/musica" element={<Musica />} />
            <Route path="/oraciones" element={<Oraciones />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/jardin" element={<Jardin />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/estudio" element={<Estudio />} />
            <Route path="*" element={<Inicio />} />
          </Routes>
        </Suspense>
      </main>
      <Overlays />
      <Player />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  )
}
