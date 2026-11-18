export interface Verse {
  n: number
  t: string
  h?: string
  p?: number
  f?: string[]
}
export interface Chapter {
  c: number
  alt?: string
  v: Verse[]
}
export interface Book {
  id: string
  name: string
  intro?: string | null
  chapters: Chapter[]
}
export interface BookInfo {
  id: string
  name: string
  abbr: string
  testament: 'AT' | 'NT'
  group: string
  chapters: { c: number; alt?: string | null; verses: number }[]
}

const base = import.meta.env.BASE_URL
let indexP: Promise<BookInfo[]> | null = null
const bookCache = new Map<string, Promise<Book>>()

export function loadIndex(): Promise<BookInfo[]> {
  if (!indexP) indexP = fetch(`${base}data/bible/index.json`).then((r) => r.json())
  return indexP
}

export function loadBook(id: string): Promise<Book> {
  let p = bookCache.get(id)
  if (!p) {
    p = fetch(`${base}data/bible/${id}.json`).then((r) => {
      if (!r.ok) throw new Error('No se pudo cargar ' + id)
      return r.json()
    })
    bookCache.set(id, p)
  }
  return p
}

export function chapterKey(book: string, c: number) {
  return `b:${book}.${c}`
}
export function verseRef(book: string, c: number, v: number) {
  return `b:${book}.${c}.${v}`
}
export function parseVerseRef(ref: string) {
  const m = /^b:([a-z0-9]+)\.(\d+)\.(\d+)$/.exec(ref)
  if (!m) return null
  return { book: m[1], c: +m[2], v: +m[3] }
}

export const stripTags = (s: string) => s.replace(/<[^>]+>/g, '')

export function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

/** Libros por id (sincrónico tras cargar el índice) */
export const bookNames: Record<string, { name: string; abbr: string }> = {}
loadIndex().then((idx) => idx.forEach((b) => (bookNames[b.id] = { name: b.name, abbr: b.abbr })))

/** Abreviaturas comunes en español para resolver citas escritas por el usuario */
const ALIASES: Record<string, string> = {
  gen: 'gn', genesis: 'gn', gn: 'gn', ex: 'ex', exodo: 'ex', lv: 'lv', lev: 'lv', levitico: 'lv', nm: 'nm', num: 'nm', numeros: 'nm',
  dt: 'dt', deut: 'dt', deuteronomio: 'dt', jos: 'jos', josue: 'jos', jue: 'jue', jueces: 'jue', rt: 'rt', rut: 'rt',
  '1s': '1s', '1sam': '1s', '1samuel': '1s', '2s': '2s', '2sam': '2s', '2samuel': '2s', '1r': '1r', '1re': '1r', '1reyes': '1r',
  '2r': '2r', '2re': '2r', '2reyes': '2r', '1cr': '1cr', '1cro': '1cr', '1cronicas': '1cr', '2cr': '2cr', '2cro': '2cr', '2cronicas': '2cr',
  esd: 'esd', esdras: 'esd', ne: 'ne', neh: 'ne', nehemias: 'ne', tb: 'tb', tob: 'tb', tobias: 'tb', jdt: 'jdt', judit: 'jdt',
  est: 'est', ester: 'est', '1m': '1m', '1mac': '1m', '1macabeos': '1m', '2m': '2m', '2mac': '2m', '2macabeos': '2m', job: 'job',
  sal: 'sal', salmo: 'sal', salmos: 'sal', ps: 'sal', pr: 'pr', prov: 'pr', proverbios: 'pr', ecl: 'ecl', qo: 'ecl', eclesiastes: 'ecl',
  ct: 'ct', cant: 'ct', cantar: 'ct', sab: 'sab', sb: 'sab', sabiduria: 'sab', eclo: 'eclo', si: 'eclo', sir: 'eclo', eclesiastico: 'eclo',
  is: 'is', isa: 'is', isaias: 'is', jr: 'jr', jer: 'jr', jeremias: 'jr', lm: 'lm', lam: 'lm', lamentaciones: 'lm', ba: 'ba', bar: 'ba', baruc: 'ba',
  ez: 'ez', ezequiel: 'ez', dn: 'dn', dan: 'dn', daniel: 'dn', os: 'os', oseas: 'os', jl: 'jl', joel: 'jl', am: 'am', amos: 'am',
  abd: 'abd', abdias: 'abd', jon: 'jon', jonas: 'jon', mi: 'mi', miq: 'mi', miqueas: 'mi', na: 'na', nah: 'na', nahum: 'na',
  ha: 'ha', hab: 'ha', habacuc: 'ha', so: 'so', sof: 'so', sofonias: 'so', ag: 'ag', ageo: 'ag', za: 'za', zac: 'za', zacarias: 'za',
  ml: 'ml', mal: 'ml', malaquias: 'ml', mt: 'mt', mateo: 'mt', mc: 'mc', mr: 'mc', marcos: 'mc', lc: 'lc', lucas: 'lc', jn: 'jn', juan: 'jn',
  hch: 'hch', hechos: 'hch', rm: 'rm', rom: 'rm', romanos: 'rm', '1co': '1co', '1cor': '1co', '1corintios': '1co', '2co': '2co', '2cor': '2co',
  '2corintios': '2co', ga: 'ga', gal: 'ga', galatas: 'ga', ef: 'ef', efesios: 'ef', flp: 'flp', fil: 'flp', filipenses: 'flp',
  col: 'col', colosenses: 'col', '1ts': '1ts', '1tes': '1ts', '1tesalonicenses': '1ts', '2ts': '2ts', '2tes': '2ts', '2tesalonicenses': '2ts',
  '1tm': '1tm', '1tim': '1tm', '1timoteo': '1tm', '2tm': '2tm', '2tim': '2tm', '2timoteo': '2tm', tt: 'tt', tit: 'tt', tito: 'tt',
  flm: 'flm', filemon: 'flm', hb: 'hb', heb: 'hb', hebreos: 'hb', st: 'st', sant: 'st', stgo: 'st', santiago: 'st', '1p': '1p', '1pe': '1p',
  '1pedro': '1p', '2p': '2p', '2pe': '2p', '2pedro': '2p', '1jn': '1jn', '1juan': '1jn', '2jn': '2jn', '2juan': '2jn', '3jn': '3jn', '3juan': '3jn',
  jds: 'jds', jud: 'jds', judas: 'jds', ap: 'ap', apoc: 'ap', apocalipsis: 'ap',
}

/** Interpreta "Jn 3,16", "1 Co 13", "Génesis 1:1" → {book, c, v?} */
export function parseCitation(q: string): { book: string; c: number; v?: number } | null {
  const m = /^\s*([1-3]?\s*[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)\.?\s+(\d+)(?:\s*[,:.]\s*(\d+))?\s*$/.exec(q)
  if (!m) return null
  const key = normalize(m[1].replace(/\s+/g, ''))
  const book = ALIASES[key]
  if (!book) return null
  return { book, c: +m[2], v: m[3] ? +m[3] : undefined }
}

/** Conversión de numeración hebrea (usada por los datos geográficos) a la de la Vulgata que usa Straubinger para los Salmos */
export function hebrewToVulgatePsalm(n: number): number {
  if (n <= 8) return n
  if (n === 9 || n === 10) return 9
  if (n <= 113) return n - 1
  if (n === 114 || n === 115) return 113
  if (n === 116) return 114
  if (n <= 146) return n - 1
  if (n === 147) return 146
  return n
}
