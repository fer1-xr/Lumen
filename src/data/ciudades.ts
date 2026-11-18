/** Ciudades del Jardín: se construyen a medida que avanzas en tu estudio */
export type Req =
  | { kind: 'bible'; books: string[] }
  | { kind: 'cic'; parts: number[] }
  | { kind: 'enc' }
  | { kind: 'san' }

export interface Ciudad {
  id: string
  name: string
  subtitle: string
  verse: string
  verseRef: string // ruta del lector
  desc: string
  reqs: Req[]
  stages: string[] // descripción de lo que aparece en cada etapa (5 etapas)
}

export const CIUDADES: Ciudad[] = [
  {
    id: 'eden', name: 'Jardín del Edén', subtitle: 'Génesis', verse: '«Plantó Yahvé Dios un jardín en Edén, al oriente» (Gn 2,8)', verseRef: 'gn/2?v=8',
    desc: 'El principio de la historia: la creación, el paraíso, la caída y la promesa. Lee el Génesis para hacer brotar el jardín, sus cuatro ríos y el árbol de la vida.',
    reqs: [{ kind: 'bible', books: ['gn'] }],
    stages: ['Tierra sin forma', 'Brota la hierba y los primeros árboles', 'Los cuatro ríos del Edén', 'Flores, frutos y animales', 'El árbol de la vida resplandece'],
  },
  {
    id: 'sinai', name: 'Monte Sinaí', subtitle: 'Éxodo · Levítico · Números · Deuteronomio', verse: '«Moisés subió a Dios, y Yahvé lo llamó desde el monte» (Ex 19,3)', verseRef: 'ex/19?v=3',
    desc: 'El campamento de Israel al pie del monte de la Alianza: las tiendas de las doce tribus, el Tabernáculo y las Tablas de la Ley.',
    reqs: [{ kind: 'bible', books: ['ex', 'lv', 'nm', 'dt'] }],
    stages: ['Desierto', 'Las tiendas de las tribus', 'El atrio del Tabernáculo', 'La columna de nube y fuego', 'Las Tablas de la Ley en la cumbre'],
  },
  {
    id: 'jerico', name: 'Jericó', subtitle: 'Josué · Jueces · Rut', verse: '«Y cayó el muro desde sus cimientos» (Jos 6,20)', verseRef: 'jos/6?v=20',
    desc: 'La ciudad de las palmeras, primera conquista en la Tierra Prometida. Sus murallas, la casa de Rahab con su cordón escarlata y los campos de Belén donde espigaba Rut.',
    reqs: [{ kind: 'bible', books: ['jos', 'jue', 'rt'] }],
    stages: ['Oasis', 'Palmeras y casas', 'Murallas de Jericó', 'La casa de Rahab y el Arca', 'Los campos de trigo de Rut'],
  },
  {
    id: 'jerusalen', name: 'Jerusalén, Ciudad de David', subtitle: 'Samuel · Reyes · Crónicas', verse: '«Pedid la paz para Jerusalén» (Sal 121,6)', verseRef: 'sal/121?v=6',
    desc: 'La ciudad santa que David conquistó y donde Salomón edificó el Templo. Con cada libro histórico se alzan sus murallas, el palacio y la Casa del Señor.',
    reqs: [{ kind: 'bible', books: ['1s', '2s', '1r', '2r', '1cr', '2cr'] }],
    stages: ['La colina de Sion', 'Las casas de la ciudad', 'Murallas y torres', 'El palacio de David', 'El Templo de Salomón'],
  },
  {
    id: 'sabiduria', name: 'Casa de la Sabiduría', subtitle: 'Job · Salmos · Proverbios · Eclesiastés · Cantar · Sabiduría · Eclesiástico', verse: '«La Sabiduría edificó su casa, labró sus siete columnas» (Pr 9,1)', verseRef: 'pr/9?v=1',
    desc: 'La casa de las siete columnas, rodeada del huerto del Cantar y del arpa del salmista. Crece con los libros sapienciales.',
    reqs: [{ kind: 'bible', books: ['job', 'sal', 'pr', 'ecl', 'ct', 'sab', 'eclo'] }],
    stages: ['El cimiento', 'Las siete columnas', 'El techo y la mesa servida', 'El huerto cerrado del Cantar', 'El arpa de David y la luz'],
  },
  {
    id: 'babilonia', name: 'Babilonia del destierro', subtitle: 'Isaías · Jeremías · Lamentaciones · Baruc · Ezequiel · Daniel', verse: '«Junto a los ríos de Babilonia nos sentábamos y llorábamos» (Sal 136,1)', verseRef: 'sal/136?v=1',
    desc: 'La gran ciudad del exilio, junto al Éufrates: el zigurat, la puerta de Ishtar y los jardines colgantes. Allí los profetas mantuvieron viva la esperanza.',
    reqs: [{ kind: 'bible', books: ['is', 'jr', 'lm', 'ba', 'ez', 'dn'] }],
    stages: ['La orilla del Éufrates', 'Casas de adobe', 'La puerta de Ishtar', 'Los jardines colgantes', 'El gran zigurat'],
  },
  {
    id: 'ninive', name: 'Nínive', subtitle: 'Los doce profetas menores', verse: '«¿Y no he de tener yo piedad de Nínive, la gran ciudad?» (Jon 4,11)', verseRef: 'jon/4?v=11',
    desc: 'La gran ciudad que se convirtió con la predicación de Jonás. Junto al Tigris aparecen el gran pez y el ricino que dio sombra al profeta.',
    reqs: [{ kind: 'bible', books: ['os', 'jl', 'am', 'abd', 'jon', 'mi', 'na', 'ha', 'so', 'ag', 'za', 'ml'] }],
    stages: ['El río Tigris', 'Casas de Nínive', 'Muralla y palacio', 'El gran pez de Jonás', 'El ricino y la ciudad convertida'],
  },
  {
    id: 'templo', name: 'Jerusalén restaurada', subtitle: 'Esdras · Nehemías · Tobías · Judit · Ester · Macabeos', verse: '«Venid, reconstruyamos las murallas de Jerusalén» (Ne 2,17)', verseRef: 'ne/2?v=17',
    desc: 'El regreso del destierro: Nehemías reconstruye las murallas, se levanta el segundo Templo y los Macabeos vuelven a encender la menorá.',
    reqs: [{ kind: 'bible', books: ['esd', 'ne', 'tb', 'jdt', 'est', '1m', '2m'] }],
    stages: ['Ruinas', 'Andamios y obreros', 'Las murallas de Nehemías', 'El segundo Templo', 'La menorá encendida (Janucá)'],
  },
  {
    id: 'belen', name: 'Belén', subtitle: 'Evangelios de Mateo y Lucas', verse: '«Y tú, Belén… de ti saldrá un jefe» (Mt 2,6)', verseRef: 'mt/2?v=6',
    desc: 'La ciudad de David donde nació el Salvador: la gruta, los pastores con sus ovejas y la estrella que guió a los magos.',
    reqs: [{ kind: 'bible', books: ['mt', 'lc'] }],
    stages: ['Colinas de Judea', 'Las casas de Belén', 'Pastores y ovejas', 'La gruta del Nacimiento', 'La estrella de Belén'],
  },
  {
    id: 'cafarnaum', name: 'Cafarnaúm y el Mar de Galilea', subtitle: 'Evangelios de Marcos y Juan', verse: '«Venid conmigo y os haré pescadores de hombres» (Mc 1,17)', verseRef: 'mc/1?v=17',
    desc: '«Su ciudad»: la casa de Pedro, la sinagoga y las barcas en el lago donde Jesús llamó a los primeros discípulos.',
    reqs: [{ kind: 'bible', books: ['mc', 'jn'] }],
    stages: ['La orilla del lago', 'Casas de pescadores', 'Barcas y redes', 'La sinagoga', 'La casa de Pedro'],
  },
  {
    id: 'roma', name: 'Roma de los Apóstoles', subtitle: 'Hechos y cartas de San Pablo', verse: '«Así llegamos a Roma» (Hch 28,14)', verseRef: 'hch/28?v=14',
    desc: 'La meta de los viajes de Pablo: la capital del Imperio donde Pedro y Pablo dieron testimonio con su sangre.',
    reqs: [{ kind: 'bible', books: ['hch', 'rm', '1co', '2co', 'ga', 'ef', 'flp', 'col', '1ts', '2ts', '1tm', '2tm', 'tt', 'flm', 'hb'] }],
    stages: ['La vía Apia', 'Casas romanas', 'El acueducto', 'El foro y sus templos', 'El Coliseo'],
  },
  {
    id: 'efeso', name: 'Éfeso', subtitle: 'Cartas católicas', verse: '«Al ángel de la Iglesia de Éfeso escribe…» (Ap 2,1)', verseRef: 'ap/2?v=1',
    desc: 'La ciudad de san Juan y, según la tradición, de la Virgen María en sus últimos años: el gran teatro, la biblioteca y la casa de María.',
    reqs: [{ kind: 'bible', books: ['st', '1p', '2p', '1jn', '2jn', '3jn', 'jds'] }],
    stages: ['Colinas del Egeo', 'La calle de mármol', 'El gran teatro', 'La biblioteca de Celso', 'La casa de María'],
  },
  {
    id: 'vaticano', name: 'Ciudad del Vaticano', subtitle: 'Catecismo y Encíclicas', verse: '«Tú eres Pedro, y sobre esta piedra edificaré mi Iglesia» (Mt 16,18)', verseRef: 'mt/16?v=18',
    desc: 'La plaza y la basílica de San Pedro sobre la tumba del apóstol. Crece con cada unidad del Catecismo y cada encíclica que estudies.',
    reqs: [{ kind: 'cic', parts: [0, 1, 2, 3, 4] }, { kind: 'enc' }],
    stages: ['La colina Vaticana', 'El obelisco', 'La columnata de Bernini', 'La fachada de San Pedro', 'La cúpula de Miguel Ángel'],
  },
  {
    id: 'asis', name: 'Asís', subtitle: 'Vidas de santos', verse: '«Alabado seas, mi Señor, con todas tus criaturas» (San Francisco)', verseRef: 'sal/148?v=1',
    desc: 'La ciudad de san Francisco y santa Clara en la ladera del monte Subasio. Se construye con cada vida de santo que leas.',
    reqs: [{ kind: 'san' }],
    stages: ['El monte Subasio', 'Olivos y cipreses', 'Las casas de piedra', 'San Damián', 'La Basílica de San Francisco'],
  },
  {
    id: 'nueva-jerusalen', name: 'Nueva Jerusalén', subtitle: 'Apocalipsis', verse: '«Vi la ciudad santa, la nueva Jerusalén, que descendía del cielo» (Ap 21,2)', verseRef: 'ap/21?v=2',
    desc: 'La meta de toda la historia: la ciudad de oro puro con doce puertas de perla, el río de agua de vida y el árbol de la vida.',
    reqs: [{ kind: 'bible', books: ['ap'] }],
    stages: ['Nubes de gloria', 'Los cimientos de piedras preciosas', 'Las doce puertas de perla', 'El río de agua de vida', 'La ciudad de oro y el Cordero'],
  },
]
