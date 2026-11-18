/** Contenido abierto de Wikipedia y Wikimedia Commons para el libro de cada santo */
export interface WikiInfo {
  title: string
  url: string
  sections: { heading: string; paras: string[] }[]
  image?: string
}
export interface CommonsImg {
  thumb: string
  full: string
  title: string
  page: string
  artist?: string
}

const cache = new Map<string, Promise<unknown>>()
const once = <T,>(k: string, fn: () => Promise<T>): Promise<T> => {
  if (!cache.has(k)) cache.set(k, fn().catch((e) => { cache.delete(k); throw e }))
  return cache.get(k) as Promise<T>
}

const SKIP = /^(Referencias|Notas|Bibliografía|Enlaces externos|Véase también|Fuentes|Galería|Filmografía)/i

export function fetchWiki(query: string): Promise<WikiInfo | null> {
  return once('w:' + query, async () => {
    const u = `https://es.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=extracts|pageimages|info&inprop=url&explaintext=1&exsectionformat=wiki&piprop=original`
    const r = await fetch(u)
    const j = await r.json()
    const page = j?.query?.pages && (Object.values(j.query.pages)[0] as { title: string; extract?: string; fullurl: string; original?: { source: string } })
    if (!page?.extract) return null
    const sections: WikiInfo['sections'] = [{ heading: 'Introducción', paras: [] }]
    let skip = false
    for (const line of page.extract.split('\n')) {
      const h = /^(=+)\s*(.+?)\s*=+$/.exec(line.trim())
      if (h) {
        if (h[1].length === 2) skip = SKIP.test(h[2])
        if (!skip) sections.push({ heading: h[2], paras: [] })
        continue
      }
      const t = line.trim()
      if (!skip && t.length > 40) sections[sections.length - 1].paras.push(t.replace(/[<>]/g, ''))
    }
    return { title: page.title, url: page.fullurl, image: page.original?.source, sections: sections.filter((s) => s.paras.length) }
  })
}

export function fetchCommons(query: string, n = 12): Promise<CommonsImg[]> {
  return once(`c:${query}:${n}`, async () => {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=${n}&gsrsearch=${encodeURIComponent(query + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=640`
    const r = await fetch(u)
    const j = await r.json()
    const pages = Object.values(j?.query?.pages || {}) as { title: string; index: number; imageinfo?: { thumburl: string; url: string; descriptionurl: string; extmetadata?: { Artist?: { value: string } } }[] }[]
    return pages
      .sort((a, b) => a.index - b.index)
      .filter((p) => p.imageinfo?.[0])
      .map((p) => {
        const ii = p.imageinfo![0]
        return {
          thumb: ii.thumburl,
          full: ii.url,
          page: ii.descriptionurl,
          title: p.title.replace(/^File:|^Archivo:/, '').replace(/\.\w+$/, '').replace(/_/g, ' '),
          artist: ii.extmetadata?.Artist?.value.replace(/<[^>]+>/g, '').trim().slice(0, 80),
        }
      })
  })
}
