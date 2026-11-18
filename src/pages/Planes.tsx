import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIndex } from './Bible'
import { useStore } from '../lib/store'
import type { BookInfo } from '../lib/bible'
import { Progress } from '../components/Common'

interface PlanDef {
  id: string
  name: string
  desc: string
  days: number
  books: (idx: BookInfo[]) => string[]
}

export const PLANES: PlanDef[] = [
  { id: 'evangelios-30', name: 'Los cuatro Evangelios en 30 días', desc: 'Mateo, Marcos, Lucas y Juan: unos 3 capítulos al día.', days: 30, books: () => ['mt', 'mc', 'lc', 'jn'] },
  { id: 'nt-90', name: 'Nuevo Testamento en 90 días', desc: 'Los 27 libros del Nuevo Testamento en tres meses.', days: 90, books: (i) => i.filter((b) => b.testament === 'NT').map((b) => b.id) },
  { id: 'salmos-60', name: 'Salmos y Proverbios en 60 días', desc: 'Oración y sabiduría: unos 3 capítulos al día.', days: 60, books: () => ['sal', 'pr'] },
  { id: 'biblia-365', name: 'Toda la Biblia en un año', desc: 'Los 73 libros, en orden canónico, en 365 días (≈ 3,7 capítulos diarios).', days: 365, books: (i) => i.map((b) => b.id) },
  { id: 'pentateuco-40', name: 'El Pentateuco en 40 días', desc: 'Como Israel en el desierto: Génesis a Deuteronomio.', days: 40, books: () => ['gn', 'ex', 'lv', 'nm', 'dt'] },
]

export function planDays(p: PlanDef, idx: BookInfo[]) {
  const chs: { b: string; c: number; name: string }[] = []
  for (const id of p.books(idx)) {
    const info = idx.find((x) => x.id === id)!
    info.chapters.forEach((c) => chs.push({ b: id, c: c.c, name: info.abbr }))
  }
  const days: (typeof chs)[] = []
  for (let d = 0; d < p.days; d++) {
    days.push(chs.slice(Math.round((d * chs.length) / p.days), Math.round(((d + 1) * chs.length) / p.days)))
  }
  return days
}

export function Planes() {
  const idx = useIndex()
  const settings = useStore((s) => s.settings)
  const setSettings = useStore((s) => s.setSettings)
  const read = useStore((s) => s.read)
  const plan = PLANES.find((p) => p.id === settings.activePlan)
  const days = useMemo(() => (plan && idx ? planDays(plan, idx) : []), [plan, idx])
  if (!idx) return <div className="loading">Cargando…</div>
  const today = plan && settings.planStart ? Math.min(plan.days - 1, Math.max(0, Math.floor((Date.now() - settings.planStart) / 86400000))) : 0
  const doneDays = days.filter((d) => d.every((x) => read[`b:${x.b}.${x.c}`])).length
  return (
    <div className="page">
      <header className="page-head">
        <h1>Planes de lectura</h1>
        <p className="subtitle">Elige un plan; los capítulos que marques como leídos se registran automáticamente.</p>
      </header>
      {plan ? (
        <section className="plan-active">
          <div className="row between wrap">
            <div>
              <div className="kicker">Plan activo</div>
              <h2>{plan.name}</h2>
            </div>
            <button className="btn ghost" onClick={() => confirm('¿Abandonar este plan?') && setSettings({ activePlan: undefined, planStart: undefined })}>
              Cambiar de plan
            </button>
          </div>
          <Progress value={doneDays} total={plan.days} />
          <h3>Hoy · día {today + 1}</h3>
          <div className="row gap wrap">
            {days[today]?.map((x) => (
              <Link key={x.b + x.c} className={'chip big' + (read[`b:${x.b}.${x.c}`] ? ' done' : '')} to={`/biblia/${x.b}/${x.c}`}>
                {x.name} {x.c}
              </Link>
            ))}
          </div>
          <h3>Calendario</h3>
          <div className="plan-grid">
            {days.map((d, i) => {
              const ok = d.every((x) => read[`b:${x.b}.${x.c}`])
              return (
                <Link
                  key={i}
                  to={d[0] ? `/biblia/${d[0].b}/${d[0].c}` : '#'}
                  className={'plan-day' + (ok ? ' done' : '') + (i === today ? ' today' : '')}
                  title={d.map((x) => `${x.name} ${x.c}`).join(', ')}
                >
                  <span className="pd-n">{i + 1}</span>
                  <span className="pd-r">{d.length ? `${d[0].name} ${d[0].c}${d.length > 1 ? `–${d[d.length - 1].name === d[0].name ? '' : d[d.length - 1].name + ' '}${d[d.length - 1].c}` : ''}` : ''}</span>
                </Link>
              )
            })}
          </div>
        </section>
      ) : (
        <div className="plan-list">
          {PLANES.map((p) => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p className="muted">{p.desc}</p>
              <button className="btn primary" onClick={() => setSettings({ activePlan: p.id, planStart: new Date().setHours(0, 0, 0, 0) })}>
                Comenzar hoy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
