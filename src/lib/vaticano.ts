import { useEffect, useState } from 'react'

/**
 * Documentos pontificios completos tomados de vatican.va (de León XIII a León XIV).
 * Los datos se generan con scripts/vaticano/ y se guardan comprimidos en public/data/vaticano/.
 */

/** Bloque de texto: [tipo, html con <em>/<strong>]. Tipos: p párrafo, c centrado, r a la derecha, h título, q cita */
export type Block = [string, string]

export interface VatDoc {
  id: string
  title: string
  pope: number
  cat: number
  date: string
  lang: string
  src: string
  words: number
  chunk: number
}

export interface VatIndex {
  popes: [string, string][]
  cats: [string, string][]
  docs: VatDoc[]
  byId: Map<string, VatDoc>
}

const base = import.meta.env.BASE_URL + 'data/vaticano/'
export const VATICAN = 'https://www.vatican.va'
/** Índice de la categoría «Encíclicas» */
export const ENC_CAT = 0

export const LANGS: Record<string, string> = { es: 'Español', it: 'Italiano', la: 'Latín', en: 'Inglés', fr: 'Francés', pt: 'Portugués', de: 'Alemán' }

/** Identificadores de la antigua lista de encíclicas → nuevos identificadores */
export const LEGACY: Record<string, string> = {
  'aeterni-patris': 'leo-xiii.hf_l-xiii_enc_04081879_aeterni-patris', 'rerum-novarum': 'leo-xiii.hf_l-xiii_enc_15051891_rerum-novarum', 'providentissimus-deus': 'leo-xiii.hf_l-xiii_enc_18111893_providentissimus-deus', 'pascendi': 'pius-x.hf_p-x_enc_19070908_pascendi-dominici-gregis', 'quas-primas': 'pius-xi.hf_p-xi_enc_11121925_quas-primas', 'casti-connubii': 'pius-xi.hf_p-xi_enc_19301231_casti-connubii', 'quadragesimo-anno': 'pius-xi.hf_p-xi_enc_19310515_quadragesimo-anno', 'mit-brennender-sorge': 'pius-xi.hf_p-xi_enc_14031937_mit-brennender-sorge', 'divini-redemptoris': 'pius-xi.hf_p-xi_enc_19370319_divini-redemptoris', 'mystici-corporis': 'pius-xii.hf_p-xii_enc_29061943_mystici-corporis-christi', 'divino-afflante': 'pius-xii.hf_p-xii_enc_30091943_divino-afflante-spiritu', 'mediator-dei': 'pius-xii.hf_p-xii_enc_20111947_mediator-dei', 'humani-generis': 'pius-xii.hf_p-xii_enc_12081950_humani-generis', 'haurietis-aquas': 'pius-xii.hf_p-xii_enc_15051956_haurietis-aquas', 'mater-et-magistra': 'john-xxiii.hf_j-xxiii_enc_15051961_mater', 'pacem-in-terris': 'john-xxiii.hf_j-xxiii_enc_11041963_pacem', 'ecclesiam-suam': 'paul-vi.hf_p-vi_enc_06081964_ecclesiam', 'mysterium-fidei': 'paul-vi.hf_p-vi_enc_03091965_mysterium', 'populorum-progressio': 'paul-vi.hf_p-vi_enc_26031967_populorum', 'humanae-vitae': 'paul-vi.hf_p-vi_enc_25071968_humanae-vitae', 'redemptor-hominis': 'john-paul-ii.hf_jp-ii_enc_04031979_redemptor-hominis', 'dives-in-misericordia': 'john-paul-ii.hf_jp-ii_enc_30111980_dives-in-misericordia', 'laborem-exercens': 'john-paul-ii.hf_jp-ii_enc_14091981_laborem-exercens', 'dominum-et-vivificantem': 'john-paul-ii.hf_jp-ii_enc_18051986_dominum-et-vivificantem', 'redemptoris-mater': 'john-paul-ii.hf_jp-ii_enc_25031987_redemptoris-mater', 'sollicitudo-rei-socialis': 'john-paul-ii.hf_jp-ii_enc_30121987_sollicitudo-rei-socialis', 'redemptoris-missio': 'john-paul-ii.hf_jp-ii_enc_07121990_redemptoris-missio', 'centesimus-annus': 'john-paul-ii.hf_jp-ii_enc_01051991_centesimus-annus', 'veritatis-splendor': 'john-paul-ii.hf_jp-ii_enc_06081993_veritatis-splendor', 'evangelium-vitae': 'john-paul-ii.hf_jp-ii_enc_25031995_evangelium-vitae', 'ut-unum-sint': 'john-paul-ii.hf_jp-ii_enc_25051995_ut-unum-sint', 'fides-et-ratio': 'john-paul-ii.hf_jp-ii_enc_14091998_fides-et-ratio', 'ecclesia-de-eucharistia': 'john-paul-ii.hf_jp-ii_enc_20030417_eccl-de-euch', 'deus-caritas-est': 'benedict-xvi.hf_ben-xvi_enc_20051225_deus-caritas-est', 'spe-salvi': 'benedict-xvi.hf_ben-xvi_enc_20071130_spe-salvi', 'caritas-in-veritate': 'benedict-xvi.hf_ben-xvi_enc_20090629_caritas-in-veritate', 'lumen-fidei': 'francesco.papa-francesco_20130629_enciclica-lumen-fidei', 'laudato-si': 'francesco.papa-francesco_20150524_enciclica-laudato-si', 'fratelli-tutti': 'francesco.papa-francesco_20201003_enciclica-fratelli-tutti', 'dilexit-nos': 'francesco.20241024-enciclica-dilexit-nos', 'magnifica-humanitas': 'leo-xiv.20260515-magnifica-humanitas',
}

/** Descarga un .json.gz y lo descomprime (si el servidor ya lo descomprimió, lo lee tal cual) */
async function loadGz<T>(url: string): Promise<T> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  const buf = new Uint8Array(await r.arrayBuffer())
  if (buf[0] === 0x1f && buf[1] === 0x8b) {
    const stream = new Blob([buf]).stream().pipeThrough(new DecompressionStream('gzip'))
    return JSON.parse(await new Response(stream).text())
  }
  return JSON.parse(new TextDecoder().decode(buf))
}

let indexP: Promise<VatIndex> | null = null
let indexV: VatIndex | null = null

export function loadVatIndex(): Promise<VatIndex> {
  if (!indexP)
    indexP = loadGz<{ popes: [string, string][]; cats: [string, string][]; docs: (string | number)[][] }>(base + 'index.json.gz').then((raw) => {
      const docs: VatDoc[] = raw.docs.map((d) => ({
        id: d[0] as string,
        title: d[1] as string,
        pope: d[2] as number,
        cat: d[3] as number,
        date: d[4] as string,
        lang: d[5] as string,
        src: d[6] as string,
        words: d[7] as number,
        chunk: d[8] as number,
      }))
      indexV = { popes: raw.popes, cats: raw.cats, docs, byId: new Map(docs.map((d) => [d.id, d])) }
      return indexV
    }).catch((e) => {
      indexP = null
      throw e
    })
  return indexP
}

/** Índice ya cargado (o null) — para usos síncronos como etiquetas */
export const vatIndexNow = () => indexV

export function useVatIndex() {
  const [idx, setIdx] = useState<VatIndex | null>(indexV)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (idx) return
    let alive = true
    loadVatIndex().then((v) => alive && setIdx(v), () => alive && setError(true))
    return () => {
      alive = false
    }
  }, [idx])
  return { idx, error }
}

const chunks = new Map<number, Promise<Record<string, Block[]>>>()

export async function loadVatDoc(id: string): Promise<Block[]> {
  const idx = await loadVatIndex()
  const d = idx.byId.get(LEGACY[id] || id)
  if (!d) throw new Error('No encontrado')
  let p = chunks.get(d.chunk)
  if (!p) {
    p = loadGz<Record<string, Block[]>>(`${base}c/${d.chunk}.json.gz`)
    p.catch(() => chunks.delete(d.chunk))
    chunks.set(d.chunk, p)
  }
  return (await p)[d.id] || []
}

/** Título legible aunque el índice aún no se haya cargado */
export function vatTitle(id: string) {
  const real = LEGACY[id] || id
  const d = indexV?.byId.get(real)
  if (d) return d.title
  const slug = real.split('.').slice(1).join('.')
  return slug.replace(/^(hf_[\w-]+?_\w+?_\d{8}_|papa-francesco_\d{8}_|\d{8}-)/, '').replace(/-/g, ' ')
}

export const fmtDate = (d: string) => (d ? new Date(d + 'T12:00:00').toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' }) : '')

/** Normaliza para buscar sin acentos */
export const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
