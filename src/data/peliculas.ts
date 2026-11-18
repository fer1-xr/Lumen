/** Repositorio de películas católicas — obras de dominio público alojadas en Internet Archive */
export interface Pelicula {
  id: string
  title: string
  original?: string
  year: number
  director: string
  minutes?: number
  tags: string[]
  synopsis: string
  /** URL embebible (archive.org/embed, youtube-nocookie, mp4…) */
  src: string
  source: string
  custom?: boolean
}

const ia = (id: string) => `https://archive.org/embed/${id}`

export const PELICULAS: Pelicula[] = [
  {
    id: 'rey-de-reyes', title: 'Rey de reyes', original: 'The King of Kings', year: 1927, director: 'Cecil B. DeMille', minutes: 155,
    tags: ['Jesús', 'Pasión', 'Clásico mudo'],
    synopsis: 'La vida pública, pasión, muerte y resurrección de Cristo vistas desde María Magdalena y los apóstoles. Una de las grandes películas religiosas del cine mudo, con escenas en Technicolor primitivo.',
    src: ia('TheKingOfKings1927ByCecilB.DeMille'), source: 'Internet Archive',
  },
  {
    id: 'pesebre-cruz', title: 'Del pesebre a la cruz', original: 'From the Manger to the Cross', year: 1912, director: 'Sidney Olcott', minutes: 71,
    tags: ['Jesús', 'Navidad', 'Pasión'],
    synopsis: 'Primera gran vida de Cristo rodada en Tierra Santa y Egipto: desde la Anunciación hasta el Calvario. Preservada en el Registro Nacional de Cine de EE. UU.',
    src: ia('JesusOfNazareth1912'), source: 'Internet Archive',
  },
  {
    id: 'juana-de-arco', title: 'La pasión de Juana de Arco', original: 'La Passion de Jeanne d’Arc', year: 1928, director: 'Carl Theodor Dreyer', minutes: 82,
    tags: ['Santos', 'Mártires', 'Clásico mudo'],
    synopsis: 'El juicio y martirio de Santa Juana de Arco reconstruidos a partir de las actas del proceso. Célebre por los primeros planos de Renée Falconetti; considerada una de las mejores películas de la historia.',
    src: ia('passion-of-joan-of-arc-rendered'), source: 'Internet Archive',
  },
  {
    id: 'ben-hur', title: 'Ben-Hur: una historia de Cristo', original: 'Ben-Hur: A Tale of the Christ', year: 1925, director: 'Fred Niblo', minutes: 143,
    tags: ['Jesús', 'Época romana', 'Clásico mudo'],
    synopsis: 'Judá Ben-Hur, príncipe judío traicionado por su amigo romano, sobrevive a las galeras y a la carrera de cuadrigas hasta encontrarse con Cristo, que sana a su madre y hermana. Con subtítulos en español.',
    src: ia('BenHurVOSEFredNiblo1925'), source: 'Internet Archive',
  },
  {
    id: 'quo-vadis', title: 'Quo Vadis', year: 1912, director: 'Enrico Guazzoni', minutes: 120,
    tags: ['Mártires', 'Época romana', 'San Pedro'],
    synopsis: 'Basada en la novela de Henryk Sienkiewicz: los primeros cristianos de Roma bajo Nerón, el incendio de la ciudad y el encuentro de San Pedro con el Señor en la Vía Apia.',
    src: ia('quovadis1912'), source: 'Internet Archive',
  },
  {
    id: 'diez-mandamientos', title: 'Los diez mandamientos', original: 'The Ten Commandments', year: 1923, director: 'Cecil B. DeMille', minutes: 136,
    tags: ['Antiguo Testamento', 'Moisés'],
    synopsis: 'Prólogo bíblico del Éxodo —Moisés, el mar Rojo y el Sinaí— seguido de una parábola moderna sobre lo que sucede cuando se desprecian los mandamientos de Dios.',
    src: ia('thetencommandments1923syncedsymphonicmusic'), source: 'Internet Archive',
  },
  {
    id: 'fabiola', title: 'Fabiola', year: 1918, director: 'Enrico Guazzoni',
    tags: ['Mártires', 'Época romana', 'Santa Inés'],
    synopsis: 'Adaptación de la novela del cardenal Wiseman sobre la Iglesia de las catacumbas: la conversión de la patricia Fabiola y los martirios de San Sebastián y Santa Inés.',
    src: ia('silent-fabiola'), source: 'Internet Archive',
  },
  {
    id: 'golgota', title: 'Gólgota', original: 'Golgotha', year: 1935, director: 'Julien Duvivier', minutes: 97,
    tags: ['Jesús', 'Pasión', 'Semana Santa'],
    synopsis: 'La Semana Santa desde la entrada en Jerusalén hasta la Resurrección, con Jean Gabin como Poncio Pilato. Primera vida de Cristo sonora del cine francés.',
    src: ia('golgotha_1935'), source: 'Internet Archive',
  },
]

/** Convierte un enlace de YouTube / Archive / Vimeo a su versión embebible */
export function toEmbed(url: string): string | null {
  const u = url.trim()
  let m = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/.exec(u)
  if (m) return `https://www.youtube-nocookie.com/embed/${m[1]}`
  m = /youtube\.com\/.*[?&]list=([\w-]+)/.exec(u)
  if (m) return `https://www.youtube-nocookie.com/embed/videoseries?list=${m[1]}`
  m = /archive\.org\/(?:details|embed)\/([^/?#]+)/.exec(u)
  if (m) return `https://archive.org/embed/${m[1]}`
  m = /vimeo\.com\/(?:video\/)?(\d+)/.exec(u)
  if (m) return `https://player.vimeo.com/video/${m[1]}`
  if (/^https?:\/\/.+\.(mp4|webm|ogv)(\?.*)?$/i.test(u)) return u
  return null
}
export const isFile = (src: string) => /\.(mp4|webm|ogv|mp3|ogg|m4a)(\?.*)?$/i.test(src)
