import { useMemo } from 'react'
import { useStore } from './store'
import { useIndex } from '../pages/Bible'
import { CIC } from '../data/catecismo'
import { ENC_CAT, useVatIndex, type VatIndex } from './vaticano'
import { SANTOS } from '../data/santos'
import { CIUDADES, type Ciudad, type Req } from '../data/ciudades'
import type { BookInfo } from './bible'

export interface ReqProgress {
  label: string
  done: number
  total: number
  link: string
}

const encIds = (v: VatIndex | null) => (v ? v.docs.filter((d) => d.cat === ENC_CAT).map((d) => d.id) : [])

export function reqProgress(r: Req, read: Record<string, number>, idx: BookInfo[], vat: VatIndex | null = null): ReqProgress[] {
  if (r.kind === 'bible')
    return r.books.map((b) => {
      const info = idx.find((x) => x.id === b)
      if (!info) return { label: b, done: 0, total: 1, link: '/biblia' }
      const done = info.chapters.filter((c) => read[`b:${b}.${c.c}`]).length
      const next = info.chapters.find((c) => !read[`b:${b}.${c.c}`]) ?? info.chapters[0]
      return { label: info.name, done, total: info.chapters.length, link: `/biblia/${b}/${next.c}` }
    })
  if (r.kind === 'cic') {
    const units = CIC.filter((u) => r.parts.includes(u.part))
    return [{ label: 'Catecismo', done: units.filter((u) => read['cic:' + u.id]).length, total: units.length, link: '/catecismo' }]
  }
  if (r.kind === 'enc') {
    const ids = encIds(vat)
    return [{ label: 'Encíclicas', done: ids.filter((id) => read['enc:' + id]).length, total: ids.length || 1, link: '/enciclicas' }]
  }
  return [{ label: 'Vidas de santos', done: SANTOS.filter((s) => read['san:' + s.id]).length, total: SANTOS.length, link: '/santos' }]
}

export function cityProgress(c: Ciudad, read: Record<string, number>, idx: BookInfo[], vat: VatIndex | null = null) {
  const parts = c.reqs.flatMap((r) => reqProgress(r, read, idx, vat))
  const done = parts.reduce((a, p) => a + p.done, 0)
  const total = parts.reduce((a, p) => a + p.total, 0)
  return { parts, done, total, pct: total ? done / total : 0 }
}

/** Nivel 0..5 de una ciudad según el porcentaje */
export const levelOf = (pct: number) => (pct >= 1 ? 5 : pct >= 0.75 ? 4 : pct >= 0.5 ? 3 : pct >= 0.25 ? 2 : pct > 0 ? 1 : 0)

export function useCities() {
  const read = useStore((s) => s.read)
  const idx = useIndex()
  const { idx: vat } = useVatIndex()
  return useMemo(() => {
    if (!idx) return null
    return CIUDADES.map((c) => ({ city: c, ...cityProgress(c, read, idx, vat) }))
  }, [read, idx, vat])
}

export function useTotals() {
  const read = useStore((s) => s.read)
  const idx = useIndex()
  const { idx: vat } = useVatIndex()
  return useMemo(() => {
    const encs = encIds(vat)
    const keys = Object.keys(read)
    const totalCh = idx ? idx.reduce((a, b) => a + b.chapters.length, 0) : 1334
    return {
      bible: keys.filter((k) => k.startsWith('b:')).length,
      bibleTotal: totalCh,
      cic: keys.filter((k) => k.startsWith('cic:')).length,
      cicTotal: CIC.length,
      enc: encs.filter((id) => read['enc:' + id]).length,
      encTotal: encs.length || 221,
      san: keys.filter((k) => k.startsWith('san:')).length,
      sanTotal: SANTOS.length,
    }
  }, [read, idx, vat])
}
