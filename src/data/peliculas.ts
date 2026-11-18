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
const yt = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`
const Y = 'YouTube'

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
  { id: 'teresa-2015', title: 'Teresa', year: 2015, director: 'Jorge Dorado', minutes: 110, tags: ["Santos", "Doctoras de la Iglesia"], synopsis: 'Telefilme sobre Santa Teresa de Jesús: su vocación en Ávila, su lucha interior y la reforma del Carmelo, con Marian Álvarez.', src: yt('DMdcXmnchv8'), source: Y },
  { id: 'santa-teresa-avila', title: 'Santa Teresa de Jesús', year: 1984, director: 'Josefina Molina', minutes: 127, tags: ["Santos", "Doctoras de la Iglesia"], synopsis: 'La vida de la gran mística castellana, desde su ingreso en el convento de la Encarnación hasta las fundaciones del Carmelo descalzo.', src: yt('k2TiwHZnFPw'), source: Y },
  { id: 'hildegarda', title: 'Visión: la historia de Hildegarda de Bingen', year: 2009, director: 'Margarethe von Trotta', minutes: 106, tags: ["Santos", "Doctoras de la Iglesia", "Edad Media"], synopsis: 'La abadesa benedictina, mística, compositora y doctora de la Iglesia que transformó la vida monástica del siglo XII.', src: yt('6vIUQy2fBtI'), source: Y },
  { id: 'padre-pio', title: 'Padre Pío', year: 2000, director: 'Carlo Carlei', minutes: 200, tags: ["Santos", "Siglo XX"], synopsis: 'Miniserie sobre el capuchino de Pietrelcina: los estigmas, el confesionario, las pruebas y la Casa Alivio del Sufrimiento.', src: yt('_WypuTEnigI'), source: Y },
  { id: 'madre-teresa', title: 'Madre Teresa', year: 2003, director: 'Fabrizio Costa', minutes: 110, tags: ["Santos", "Siglo XX", "Caridad"], synopsis: 'Olivia Hussey interpreta a la religiosa que dejó el colegio de Loreto para servir a los más pobres de Calcuta.', src: yt('nt84H8aAKKI'), source: Y },
  { id: 'santa-brigida', title: 'Santa Brígida de Suecia', year: 0, director: '—', minutes: 77, tags: ["Santos", "Edad Media"], synopsis: 'La princesa sueca, esposa y madre, que fundó la Orden del Santísimo Salvador y recibió revelaciones sobre la Pasión.', src: yt('JUIrGDZM2B4'), source: Y },
  { id: 'san-agustin', title: 'San Agustín', year: 2010, director: 'Christian Duguay', minutes: 199, tags: ["Santos", "Doctores de la Iglesia", "Padres de la Iglesia"], synopsis: 'Del joven ambicioso de Tagaste al obispo de Hipona: las lágrimas de Mónica, la conversión en Milán y la caída de Roma.', src: yt('ZDnQzyMoHmA'), source: Y },
  { id: 'san-antonio', title: 'San Antonio de Padua', year: 2021, director: '—', minutes: 100, tags: ["Santos", "Franciscanos"], synopsis: 'El fraile portugués, gran predicador franciscano y doctor evangélico, conocido en todo el mundo por sus milagros.', src: yt('lR3b9AGnz5Q'), source: Y },
  { id: 'tobias', title: 'Tobías y el ángel', year: 0, director: 'Immortal Studio', minutes: 64, tags: ["Antiguo Testamento", "Ángeles"], synopsis: 'El libro de Tobías: el viaje del joven Tobías guiado por el arcángel Rafael, la curación de su padre ciego y la victoria sobre Asmodeo.', src: yt('bP26u2R5Xzg'), source: Y },
  { id: 'cielo-roma', title: 'Bajo el cielo de Roma', year: 2010, director: 'Christian Duguay', minutes: 205, tags: ["Papas", "Siglo XX"], synopsis: 'Pío XII durante la ocupación nazi de Roma y su labor para proteger a los judíos perseguidos.', src: yt('dIQwm8xdIC8'), source: Y },
  { id: 'hechos', title: 'Hechos de los Apóstoles', year: 0, director: '—', minutes: 192, tags: ["Nuevo Testamento", "Apóstoles"], synopsis: 'La Iglesia naciente desde Pentecostés: la predicación de Pedro, Esteban, la conversión de Pablo y sus viajes.', src: yt('SfT2k4QoafY'), source: Y },
  { id: 'cura-ars', title: 'El cura de Ars', year: 0, director: 'EWTN', minutes: 96, tags: ["Santos", "Sacerdotes"], synopsis: 'San Juan María Vianney, el humilde párroco que transformó un pueblo francés desde el confesionario. Publicada por EWTN Español.', src: yt('NT2zcqHDm2A'), source: Y },
  { id: 'charbel', title: 'San Chárbel', year: 2009, director: 'Nabil Lebbos', minutes: 104, tags: ["Santos", "Oriente"], synopsis: 'El monje ermitaño maronita del Líbano, cuya tumba se volvió fuente de innumerables milagros.', src: yt('LuMlXqCYpOY'), source: Y },
  { id: 'san-ignacio', title: 'San Ignacio de Loyola', year: 2016, director: 'Paolo Dy', minutes: 121, tags: ["Santos", "Jesuitas"], synopsis: 'Del soldado herido en Pamplona al fundador de la Compañía de Jesús y autor de los Ejercicios Espirituales.', src: yt('WTRDQanmVJE'), source: Y },
  { id: 'fray-escoba', title: 'Fray Escoba', year: 1961, director: 'Ramón Torrado', minutes: 99, tags: ["Santos", "Dominicos", "América"], synopsis: 'La vida de San Martín de Porres, el humilde fraile mulato de Lima que barría el convento y curaba a pobres y animales.', src: yt('392f2HQkFSI'), source: Y },
  { id: 'tomas-becket', title: 'Becket', year: 1964, director: 'Peter Glenville', minutes: 143, tags: ["Santos", "Mártires", "Edad Media"], synopsis: 'Santo Tomás Becket, canciller y amigo de Enrique II, que como arzobispo de Canterbury defendió la libertad de la Iglesia hasta el martirio.', src: yt('GOrZrG-fl-g'), source: Y },
  { id: 'narcisa', title: 'Santa Narcisa de Jesús', year: 0, director: '—', minutes: 76, tags: ["Santos", "América"], synopsis: 'La laica ecuatoriana que vivió en oración y penitencia en Guayaquil y Lima, canonizada en 2008.', src: yt('T_syyNIwd3A'), source: Y },
  { id: 'felipe-neri', title: 'Prefiero el Paraíso', year: 2010, director: 'Giacomo Campiotti', minutes: 126, tags: ["Santos", "Sacerdotes"], synopsis: 'San Felipe Neri, el alegre apóstol de Roma que acogía a los niños de la calle. Con Gigi Proietti.', src: yt('X-NO9XSI_jU'), source: Y },
  { id: 'santo-domingo', title: 'Santo Domingo de Guzmán', year: 0, director: '—', minutes: 89, tags: ["Santos", "Dominicos", "Edad Media"], synopsis: 'El fundador de la Orden de Predicadores y su misión entre los albigenses del sur de Francia.', src: yt('qrQ-XiQQV-I'), source: Y },
  { id: 'toribio-romo', title: 'Santo Toribio Romo', year: 0, director: '—', minutes: 122, tags: ["Santos", "Mártires", "América"], synopsis: 'El sacerdote mártir de la Guerra Cristera en México, hoy patrono de los migrantes.', src: yt('7UgiyuGs91U'), source: Y },
  { id: 'san-patricio', title: 'San Patricio', year: 0, director: '—', minutes: 92, tags: ["Santos", "Misioneros"], synopsis: 'El joven esclavo que volvió a Irlanda como obispo y la evangelizó con el trébol en la mano.', src: yt('KC3aYraE6ko'), source: Y },
  { id: 'faustina', title: 'Faustina: la Divina Misericordia', year: 1994, director: 'Jerzy Łukaszewicz', minutes: 104, tags: ["Santos", "Siglo XX", "Divina Misericordia"], synopsis: 'La religiosa polaca a quien Jesús confió el mensaje de la Divina Misericordia.', src: yt('17X5lDjYEHA'), source: Y },
  { id: 'maria-goretti', title: 'Santa María Goretti', year: 2003, director: 'Giulio Base', minutes: 96, tags: ["Santos", "Mártires", "Siglo XX"], synopsis: 'La niña italiana de 11 años que murió perdonando a su agresor, quien después se convirtió.', src: yt('nDZQDgtH2nI'), source: Y },
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

/** Imagen de previsualización (miniatura del video) */
export function poster(p: Pelicula): string | null {
  let m = /youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/.exec(p.src)
  if (m) return `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`
  m = /archive\.org\/embed\/([^/?#]+)/.exec(p.src)
  if (m) return `https://archive.org/services/img/${m[1]}`
  return null
}

/** Fragmento de previsualización silenciado (sólo YouTube) */
export function previewSrc(p: Pelicula): string | null {
  const m = /youtube(?:-nocookie)?\.com\/embed\/([\w-]{11})/.exec(p.src)
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&mute=1&controls=0&start=600&end=660&modestbranding=1&rel=0&playsinline=1` : null
}
