export interface Mark {
  start: number
  end: number
  type: 'em' | 'strong'
}

const ENT: Record<string, string> = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&#39;': "'" }

/** Convierte un texto con <em>/<strong> en texto plano + marcas de formato */
export function parseRich(html: string): { text: string; marks: Mark[] } {
  const marks: Mark[] = []
  const open: Record<string, number[]> = { em: [], strong: [] }
  let text = ''
  const re = /<(\/?)(em|strong)>|&(?:lt|gt|amp|quot|#39);/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    text += html.slice(last, m.index)
    last = re.lastIndex
    if (m[2]) {
      const t = m[2] as 'em' | 'strong'
      if (!m[1]) open[t].push(text.length)
      else {
        const s = open[t].pop()
        if (s !== undefined && s < text.length) marks.push({ start: s, end: text.length, type: t })
      }
    } else text += ENT[m[0]] ?? m[0]
  }
  text += html.slice(last)
  return { text, marks }
}

/** Texto plano (para copiar / buscar) */
export const plain = (html: string) => parseRich(html).text
