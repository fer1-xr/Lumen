import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { loadBook, loadIndex, normalize, parseCitation, type BookInfo } from '../lib/bible'
import { plain } from '../lib/rich'

interface Row {
  b: string
  abbr: string
  c: number
  v: number
  t: string
  n: string
  tst: 'AT' | 'NT'
}
let corpus: Promise<Row[]> | null = null
function loadCorpus(onProgress: (p: number) => void): Promise<Row[]> {
  if (corpus) return corpus
  corpus = (async () => {
    const idx: BookInfo[] = await loadIndex()
    const rows: Row[] = []
    let i = 0
    await Promise.all(
      idx.map(async (b) => {
        const book = await loadBook(b.id)
        for (const ch of book.chapters)
          for (const v of ch.v) {
            const t = plain(v.t).replace(/\n/g, ' ')
            rows.push({ b: b.id, abbr: b.abbr, c: ch.c, v: v.n, t, n: normalize(t), tst: b.testament })
          }
        onProgress(++i / idx.length)
      }),
    )
    const order = Object.fromEntries(idx.map((b, k) => [b.id, k]))
    rows.sort((a, b) => order[a.b] - order[b.b] || a.c - b.c || a.v - b.v)
    return rows
  })()
  return corpus
}

const STOP = new Set('de la el los las y o u a en del al que se lo por con para un una unos unas su sus es no ni mas mi tu'.split(' '))
function searchTerms(q: string) {
  const all = normalize(q.replace(/"/g, '')).split(/\s+/).filter(Boolean)
  const main = all.filter((t) => !STOP.has(t))
  return main.length ? main : all
}

export function Buscar() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')
  const [scope, setScope] = useState<'all' | 'AT' | 'NT'>('all')
  const [rows, setRows] = useState<Row[] | null>(null)
  const [prog, setProg] = useState(0)
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    loadCorpus(setProg).then(setRows)
    inputRef.current?.focus()
  }, [])
  const query = params.get('q') || ''
  const results = useMemo(() => {
    if (!rows || query.trim().length < 3) return []
    const exact = /^".*"$/.test(query.trim())
    const phrase = normalize(query.trim().replace(/^"|"$/g, ''))
    const res = searchTerms(query).map((t) => new RegExp('(^|[^a-z0-9ñ])' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    return rows.filter((r) => (scope === 'all' || r.tst === scope) && (exact ? r.n.includes(phrase) : res.every((re) => re.test(r.n))))
  }, [rows, query, scope])
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const cit = parseCitation(q)
    if (cit) return nav(`/biblia/${cit.book}/${cit.c}${cit.v ? `?v=${cit.v}` : ''}`)
    setParams({ q })
  }
  const hl = (t: string) => {
    const exact = /^".*"$/.test(query.trim())
    const terms = exact ? [normalize(query.trim().replace(/^"|"$/g, ''))] : searchTerms(query)
    if (!terms.length) return t
    const n = normalize(t)
    const marks: [number, number][] = []
    for (const term of terms) {
      let i = n.indexOf(term)
      while (i >= 0) {
        if (exact || i === 0 || !/[a-z0-9ñ]/.test(n[i - 1])) marks.push([i, i + term.length])
        i = n.indexOf(term, i + term.length)
      }
    }
    marks.sort((a, b) => a[0] - b[0])
    const out: React.ReactNode[] = []
    let last = 0
    marks.forEach(([a, b], k) => {
      if (a < last) return
      out.push(t.slice(last, a), <mark key={k}>{t.slice(a, b)}</mark>)
      last = b
    })
    out.push(t.slice(last))
    return out
  }
  return (
    <div className="page">
      <header className="page-head">
        <h1>Buscar en la Biblia</h1>
        <form onSubmit={submit} className="search-form">
          <input ref={inputRef} className="input big" value={q} onChange={(e) => setQ(e.target.value)} placeholder='Palabras ("frase exacta") o una cita: Jn 3,16' />
          <button className="btn primary">Buscar</button>
        </form>
        <div className="seg">
          {(['all', 'AT', 'NT'] as const).map((s) => (
            <button key={s} className={scope === s ? 'on' : ''} onClick={() => setScope(s)}>
              {s === 'all' ? 'Toda la Biblia' : s === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento'}
            </button>
          ))}
        </div>
      </header>
      {!rows && <div className="loading">Preparando el índice de búsqueda… {Math.round(prog * 100)}%</div>}
      {rows && query && (
        <p className="muted">
          {results.length} versículo{results.length === 1 ? '' : 's'} para «{query}»{results.length > 300 ? ' (se muestran los primeros 300)' : ''}
        </p>
      )}
      <div className="results">
        {results.slice(0, 300).map((r) => (
          <Link key={`${r.b}.${r.c}.${r.v}`} to={`/biblia/${r.b}/${r.c}?v=${r.v}`} className="result">
            <span className="result-ref">
              {r.abbr} {r.c},{r.v}
            </span>
            <span className="result-text">{hl(r.t)}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
