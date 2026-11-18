import { CIC } from '../data/catecismo'
import { LEGACY, vatTitle } from './vaticano'
import { SANTOS } from '../data/santos'
import { ORACIONES } from '../data/oraciones'
import { bookNames } from './bible'

/** Ruta de la app para una referencia anotada */
export function refLink(ref: string): string {
  const [kind, rest = ''] = ref.split(/:(.*)/s)
  if (kind === 'b') {
    const [b, c, v] = rest.split('.')
    return `/biblia/${b}/${c}${v ? `?v=${v}` : ''}`
  }
  const id = rest.split(':')[0]
  if (kind === 'cic') return `/catecismo/${id}`
  if (kind === 'enc') return `/enciclicas/${LEGACY[id] || id}`
  if (kind === 'san') return `/santos/${id}`
  if (kind === 'ora') return `/oraciones#${id}`
  return '/'
}

export function refModule(ref: string) {
  const k = ref.split(':')[0]
  return ({ b: 'Biblia', cic: 'Catecismo', enc: 'Documentos pontificios', san: 'Santos', ora: 'Oraciones' } as Record<string, string>)[k] || ''
}

export function refLabel(ref: string): string {
  const [kind, rest = ''] = ref.split(/:(.*)/s)
  if (kind === 'b') {
    const [b, c, v] = rest.split('.')
    const n = bookNames[b]?.abbr || b
    return v ? `${n} ${c},${v}` : `${bookNames[b]?.name || b} ${c}`
  }
  const id = rest.split(':')[0]
  if (kind === 'cic') return 'CEC · ' + (CIC.find((u) => u.id === id)?.title || id)
  if (kind === 'enc') return vatTitle(id)
  if (kind === 'san') return SANTOS.find((s) => s.id === id)?.name || id
  if (kind === 'ora') return ORACIONES.find((o) => o.id === id)?.title || id
  return ref
}
