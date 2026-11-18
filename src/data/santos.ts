/** Vidas de santos — biografías breves de estudio */
export interface Santo {
  id: string
  name: string
  feast: string // MM-DD
  life: string
  region: string
  patron: string
  emoji: string
  bio: string[]
  quote?: string
  lesson: string
}

export const SANTOS: Santo[] = [
  {
    id: 'maria', name: 'Santísima Virgen María', feast: '01-01', life: 's. I a. C. – s. I', region: 'Nazaret, Galilea', patron: 'Madre de Dios y Madre de la Iglesia', emoji: '💙',
    bio: [
      'Hija de Joaquín y Ana según la tradición, fue preservada de todo pecado desde su concepción. Siendo una joven de Nazaret desposada con José, recibió el anuncio del ángel Gabriel y respondió con su «hágase», concibiendo por obra del Espíritu Santo al Hijo de Dios.',
      'Acompañó a Jesús desde Belén hasta el Calvario, donde fue entregada como madre al discípulo amado. Perseveró en oración con los apóstoles esperando el Espíritu Santo en Pentecostés. Al término de su vida terrena fue asunta en cuerpo y alma al cielo. La Iglesia celebra su maternidad divina el 1 de enero.',
    ],
    quote: '«He aquí la esclava del Señor; hágase en mí según tu palabra» (Lc 1,38).',
    lesson: 'Fe que dice «sí» a Dios aun sin comprenderlo todo.',
  },
  {
    id: 'jose', name: 'San José', feast: '03-19', life: 's. I a. C. – s. I', region: 'Belén y Nazaret', patron: 'Patrono de la Iglesia universal, de los trabajadores y de la buena muerte', emoji: '🪚',
    bio: [
      'Descendiente de David y carpintero de Nazaret, esposo de la Virgen María. El Evangelio lo llama «justo». Ante el misterio de la concepción de Jesús, obedeció al ángel y recibió a María en su casa, dando al Niño un nombre, un hogar y una genealogía.',
      'Protegió a la Sagrada Familia en la huida a Egipto y educó a Jesús en el trabajo y la Ley. No se conserva ninguna palabra suya en los Evangelios: su santidad es la del silencio obediente. Pío IX lo declaró Patrono de la Iglesia universal en 1870.',
    ],
    lesson: 'Obediencia silenciosa y trabajo fiel como camino de santidad.',
  },
  {
    id: 'pedro', name: 'San Pedro Apóstol', feast: '06-29', life: '† c. 64-67', region: 'Galilea – Roma', patron: 'Primer Papa; patrono de los pescadores', emoji: '🗝️',
    bio: [
      'Simón, pescador de Betsaida, fue llamado por Jesús, que le dio el nombre de Cefas (Pedro, «roca»). Confesó a Jesús como «el Cristo, el Hijo de Dios vivo» y recibió las llaves del Reino. Negó al Maestro tres veces durante la Pasión, pero lloró amargamente y, tras la Resurrección, confesó tres veces su amor.',
      'En Pentecostés predicó con valentía y guió a la Iglesia naciente en Jerusalén. Finalmente llegó a Roma, donde murió mártir crucificado, según la tradición cabeza abajo, bajo el emperador Nerón. Sobre su tumba se levanta la Basílica de San Pedro.',
    ],
    quote: '«Señor, ¿a quién iremos? Tú tienes palabras de vida eterna» (Jn 6,68).',
    lesson: 'Dios edifica su Iglesia sobre un hombre frágil que se deja perdonar.',
  },
  {
    id: 'pablo', name: 'San Pablo Apóstol', feast: '06-29', life: 'c. 5-10 – c. 67', region: 'Tarso – Roma', patron: 'Apóstol de los gentiles; patrono de los misioneros', emoji: '⚔️',
    bio: [
      'Saulo de Tarso, fariseo celoso, perseguía a los cristianos hasta que Cristo resucitado se le apareció en el camino de Damasco. Convertido y bautizado, se convirtió en el gran apóstol de los paganos.',
      'Realizó tres grandes viajes misioneros por Asia Menor y Grecia, fundando comunidades a las que escribió cartas que forman buena parte del Nuevo Testamento. Arrestado en Jerusalén, apeló al César y fue llevado a Roma, donde murió decapitado.',
    ],
    quote: '«Ya no vivo yo, es Cristo quien vive en mí» (Ga 2,20).',
    lesson: 'La gracia puede transformar al perseguidor en apóstol.',
  },
  {
    id: 'juan-evangelista', name: 'San Juan Evangelista', feast: '12-27', life: '† c. 100', region: 'Galilea – Éfeso', patron: 'Patrono de los teólogos y escritores', emoji: '🦅',
    bio: [
      'Hijo de Zebedeo y hermano de Santiago, pescador llamado por Jesús. Es el «discípulo amado» que reclinó su cabeza en el pecho del Señor en la Última Cena y que estuvo al pie de la Cruz, donde recibió a María como madre.',
      'La tradición le atribuye el cuarto Evangelio, tres cartas y el Apocalipsis, escrito en el destierro de Patmos. Vivió hasta edad avanzada en Éfeso. Su símbolo es el águila por la altura de su contemplación.',
    ],
    quote: '«Hijitos, amaos los unos a los otros».',
    lesson: 'La contemplación del amor de Cristo se convierte en amor fraterno.',
  },
  {
    id: 'esteban', name: 'San Esteban', feast: '12-26', life: '† c. 34', region: 'Jerusalén', patron: 'Protomártir; patrono de los diáconos', emoji: '🪨',
    bio: [
      'Uno de los siete diáconos elegidos por los apóstoles para el servicio de las mesas, «lleno de fe y del Espíritu Santo». Realizaba prodigios y predicaba con una sabiduría a la que nadie podía resistir.',
      'Acusado ante el Sanedrín, pronunció un gran discurso sobre la historia de Israel. Fue apedreado fuera de la ciudad mientras veía los cielos abiertos y oraba por sus verdugos. Entre los presentes estaba Saulo, el futuro san Pablo.',
    ],
    quote: '«Señor, no les tengas en cuenta este pecado» (Hch 7,60).',
    lesson: 'Morir perdonando como Cristo.',
  },
  {
    id: 'maria-magdalena', name: 'Santa María Magdalena', feast: '07-22', life: 's. I', region: 'Magdala, Galilea', patron: 'Apóstol de los apóstoles', emoji: '🏺',
    bio: [
      'Discípula de Jesús, de quien el Señor había expulsado siete demonios. Lo siguió y sirvió con sus bienes, y permaneció junto a la Cruz cuando casi todos habían huido.',
      'Fue la primera testigo de la Resurrección: Jesús la llamó por su nombre en el huerto y la envió a anunciarlo a los apóstoles. Por eso la tradición la llama «apóstol de los apóstoles». En 2016 su memoria fue elevada a fiesta.',
    ],
    quote: '«¡He visto al Señor!» (Jn 20,18).',
    lesson: 'Quien ha sido amado mucho, ama mucho y anuncia.',
  },
  {
    id: 'agustin', name: 'San Agustín de Hipona', feast: '08-28', life: '354 – 430', region: 'Tagaste (Argelia) – Hipona', patron: 'Doctor de la Iglesia; patrono de los teólogos', emoji: '📚',
    bio: [
      'Hijo de santa Mónica, brillante profesor de retórica, buscó la verdad durante años en el maniqueísmo y la filosofía, viviendo una juventud desordenada. En Milán, la predicación de san Ambrosio y la lectura de Romanos 13 lo llevaron a la conversión; fue bautizado en 387.',
      'Ordenado sacerdote y luego obispo de Hipona, escribió obras inmensas como las «Confesiones» y «La ciudad de Dios», y combatió las herejías de su tiempo. Su pensamiento sobre la gracia, la Trinidad y la Iglesia marcó toda la teología occidental.',
    ],
    quote: '«Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti».',
    lesson: 'Nunca es tarde para convertirse: Dios busca al que lo busca.',
  },
  {
    id: 'monica', name: 'Santa Mónica', feast: '08-27', life: '332 – 387', region: 'Tagaste – Ostia', patron: 'Patrona de las madres y de las esposas', emoji: '🕯️',
    bio: [
      'Casada con un pagano de carácter violento, Patricio, lo ganó para Cristo con su paciencia. Durante años lloró y oró por la conversión de su hijo Agustín, siguiéndolo hasta Milán.',
      'Un obispo la consoló diciendo: «Es imposible que se pierda el hijo de tantas lágrimas». Vio el bautismo de Agustín y murió poco después en Ostia, en paz.',
    ],
    lesson: 'La oración perseverante de una madre es poderosa ante Dios.',
  },
  {
    id: 'jeronimo', name: 'San Jerónimo', feast: '09-30', life: 'c. 347 – 420', region: 'Estridón (Dalmacia) – Belén', patron: 'Doctor de la Iglesia; patrono de los biblistas y traductores', emoji: '🦁',
    bio: [
      'Gran estudioso de las lenguas, fue secretario del papa Dámaso, quien le encargó revisar las traducciones latinas de la Biblia. Retirado en Belén junto a la gruta de la Natividad, tradujo casi toda la Escritura desde el hebreo y el griego: la Vulgata, Biblia oficial de la Iglesia latina durante siglos.',
      'De carácter fuerte y polemista, vivió en penitencia y estudio, guiando también a mujeres consagradas como santa Paula. Su comentario a la Escritura sigue siendo una referencia.',
    ],
    quote: '«Desconocer las Escrituras es desconocer a Cristo».',
    lesson: 'Amar la Palabra de Dios estudiándola con dedicación.',
  },
  {
    id: 'benito', name: 'San Benito de Nursia', feast: '07-11', life: 'c. 480 – 547', region: 'Nursia – Montecasino (Italia)', patron: 'Patrono de Europa; padre del monacato occidental', emoji: '✝️',
    bio: [
      'Joven de familia noble, dejó los estudios en Roma para vivir como ermitaño en Subiaco. Fundó varios monasterios y finalmente el de Montecasino, donde escribió su Regla, equilibrada y sabia, que organizó la vida monástica de Occidente.',
      'Su lema «ora et labora» unió oración y trabajo; los monasterios benedictinos conservaron la cultura antigua y evangelizaron Europa. Su hermana, santa Escolástica, fue también santa.',
    ],
    quote: '«No anteponer nada al amor de Cristo» (Regla, cap. 4).',
    lesson: 'Ordenar la vida entera en torno a Dios: oración, trabajo y comunidad.',
  },
  {
    id: 'patricio', name: 'San Patricio', feast: '03-17', life: 'c. 385 – 461', region: 'Britania – Irlanda', patron: 'Apóstol y patrono de Irlanda', emoji: '☘️',
    bio: [
      'Capturado a los dieciséis años por piratas, fue esclavo en Irlanda, donde aprendió a orar día y noche. Escapó, se formó y, sintiendo en sueños el llamado de los irlandeses, regresó como obispo misionero.',
      'Evangelizó la isla durante unos treinta años, ordenando clero y fundando iglesias. La tradición dice que explicaba la Trinidad con un trébol.',
    ],
    lesson: 'Volver con amor a quienes un día nos hicieron daño.',
  },
  {
    id: 'francisco-asis', name: 'San Francisco de Asís', feast: '10-04', life: '1181/82 – 1226', region: 'Asís (Italia)', patron: 'Patrono de la ecología y de Italia', emoji: '🐦',
    bio: [
      'Hijo de un rico comerciante, soñaba con la gloria de la caballería. Tras una enfermedad y la experiencia de abrazar a un leproso, oyó al Crucifijo de San Damián decirle: «Francisco, repara mi Iglesia». Renunció a todo ante el obispo y abrazó la pobreza evangélica.',
      'Fundó la Orden de los Hermanos Menores, que se extendió rápidamente. Viajó a Egipto a hablar con el sultán, creó el primer belén en Greccio y recibió los estigmas en el monte Alverna. Compuso el «Cántico de las criaturas», alabando a Dios por el hermano sol y la hermana luna.',
    ],
    quote: '«Alabado seas, mi Señor, con todas tus criaturas».',
    lesson: 'La alegría de la pobreza y la fraternidad con toda la creación.',
  },
  {
    id: 'clara', name: 'Santa Clara de Asís', feast: '08-11', life: '1194 – 1253', region: 'Asís (Italia)', patron: 'Patrona de la televisión', emoji: '🪔',
    bio: [
      'Joven noble de Asís, conmovida por la predicación de Francisco, huyó de su casa la noche del Domingo de Ramos de 1212 para consagrarse a Dios. Fundó las Damas Pobres (clarisas) en San Damián.',
      'Defendió con tenacidad el «privilegio de la pobreza». Cuenta la tradición que alejó a los soldados que asaltaban Asís mostrando la Eucaristía. Su regla fue la primera escrita por una mujer aprobada por un papa.',
    ],
    lesson: 'Contemplar a Cristo pobre y dejarse transformar en Él.',
  },
  {
    id: 'domingo', name: 'Santo Domingo de Guzmán', feast: '08-08', life: '1170 – 1221', region: 'Caleruega (España) – Bolonia', patron: 'Fundador de la Orden de Predicadores', emoji: '🐕',
    bio: [
      'Canónigo de Osma, al viajar por el sur de Francia descubrió la necesidad de predicar con doctrina y pobreza a quienes habían caído en la herejía albigense. Fundó la Orden de Predicadores (dominicos), dedicada al estudio y a la predicación.',
      'Envió a sus frailes a las universidades y ciudades. La tradición le asocia la difusión del Santo Rosario. Hablaba «con Dios o de Dios».',
    ],
    lesson: 'Contemplar y dar a los demás lo contemplado.',
  },
  {
    id: 'tomas-aquino', name: 'Santo Tomás de Aquino', feast: '01-28', life: '1225 – 1274', region: 'Roccasecca (Italia) – Fossanova', patron: 'Doctor Angélico; patrono de los estudiantes', emoji: '☀️',
    bio: [
      'Ingresó en los dominicos contra la voluntad de su familia, que llegó a encerrarlo. Discípulo de san Alberto Magno, sus compañeros lo llamaban «el buey mudo», pero su maestro predijo que sus mugidos se oirían en todo el mundo.',
      'Escribió la «Suma Teológica», síntesis admirable de fe y razón, y los himnos eucarísticos del Corpus Christi (Pange lingua, Adoro te devote). Al final de su vida, tras una experiencia mística, dijo que todo lo escrito le parecía paja comparado con lo que había visto.',
    ],
    quote: '«Señor, no quiero otra recompensa que a Ti».',
    lesson: 'La inteligencia al servicio de la verdad y de la adoración.',
  },
  {
    id: 'catalina-siena', name: 'Santa Catalina de Siena', feast: '04-29', life: '1347 – 1380', region: 'Siena (Italia)', patron: 'Doctora de la Iglesia; patrona de Europa e Italia', emoji: '🔥',
    bio: [
      'Penúltima de veinticinco hijos, desde niña se consagró a Dios. Terciaria dominica, vivió una intensa vida mística y de servicio a enfermos y presos. Sin haber estudiado, dictó el «Diálogo» y cientos de cartas a papas, reyes y gente sencilla.',
      'Trabajó incansablemente por la paz y convenció al papa Gregorio XI de regresar de Aviñón a Roma. Murió a los 33 años ofreciendo su vida por la Iglesia.',
    ],
    quote: '«Si sois lo que debéis ser, prenderéis fuego al mundo entero».',
    lesson: 'Amor apasionado por la Iglesia, hasta corregirla con valentía.',
  },
  {
    id: 'juana-arco', name: 'Santa Juana de Arco', feast: '05-30', life: '1412 – 1431', region: 'Domrémy – Ruan (Francia)', patron: 'Patrona de Francia', emoji: '⚜️',
    bio: [
      'Joven campesina analfabeta que escuchó las voces de san Miguel, santa Catalina y santa Margarita pidiéndole liberar a Francia. Convenció al delfín Carlos y encabezó el ejército que levantó el asedio de Orleans en 1429.',
      'Capturada y juzgada por un tribunal parcial, fue quemada viva en Ruan a los 19 años, invocando el nombre de Jesús. Un proceso posterior la rehabilitó y fue canonizada en 1920.',
    ],
    quote: '«Actuad, y Dios actuará».',
    lesson: 'Fidelidad a la propia vocación aunque cueste la vida.',
  },
  {
    id: 'ignacio-loyola', name: 'San Ignacio de Loyola', feast: '07-31', life: '1491 – 1556', region: 'Loyola (España) – Roma', patron: 'Fundador de la Compañía de Jesús; patrono de los ejercicios espirituales', emoji: '✠',
    bio: [
      'Caballero vasco herido en la defensa de Pamplona (1521), durante la convalecencia leyó vidas de Cristo y de los santos y descubrió el discernimiento de espíritus. En la cueva de Manresa escribió los «Ejercicios Espirituales».',
      'Estudió en París, donde reunió a sus primeros compañeros, entre ellos Francisco Javier. En 1540 el papa aprobó la Compañía de Jesús, que se dedicó a la educación, las misiones y la reforma católica.',
    ],
    quote: '«En todo amar y servir».',
    lesson: 'Discernir para buscar en todo la mayor gloria de Dios (A.M.D.G.).',
  },
  {
    id: 'francisco-javier', name: 'San Francisco Javier', feast: '12-03', life: '1506 – 1552', region: 'Javier (España) – Asia', patron: 'Patrono de las misiones', emoji: '🌏',
    bio: [
      'Compañero de san Ignacio en París, uno de los primeros jesuitas. Partió en 1541 hacia la India como misionero y recorrió Goa, Malaca, las Molucas y Japón, bautizando a miles de personas.',
      'Murió en la isla de Sancián, a las puertas de China, que tanto deseaba evangelizar. Es patrono de las misiones junto a santa Teresa del Niño Jesús.',
    ],
    quote: '«¿De qué le sirve al hombre ganar el mundo entero si pierde su alma?» (frase de Ignacio que lo convirtió).',
    lesson: 'Un corazón que no conoce fronteras para anunciar a Cristo.',
  },
  {
    id: 'teresa-avila', name: 'Santa Teresa de Jesús (de Ávila)', feast: '10-15', life: '1515 – 1582', region: 'Ávila (España)', patron: 'Doctora de la Iglesia; patrona de los escritores españoles', emoji: '🏰',
    bio: [
      'Monja carmelita durante años tibia, a los 39 años vivió una profunda conversión ante una imagen de Cristo llagado. Emprendió la reforma del Carmelo, fundando diecisiete conventos de carmelitas descalzas en medio de grandes dificultades.',
      'Maestra de oración, escribió el «Libro de la Vida», «Camino de perfección» y «Las Moradas», que describen el camino del alma hacia la unión con Dios. Fue la primera mujer declarada doctora de la Iglesia (1970).',
    ],
    quote: '«Nada te turbe, nada te espante… quien a Dios tiene nada le falta: solo Dios basta».',
    lesson: 'La oración es tratar de amistad con quien sabemos que nos ama.',
  },
  {
    id: 'juan-cruz', name: 'San Juan de la Cruz', feast: '12-14', life: '1542 – 1591', region: 'Fontiveros (España) – Úbeda', patron: 'Doctor místico; patrono de los poetas en lengua española', emoji: '🌙',
    bio: [
      'De familia muy pobre, ingresó en el Carmelo y, animado por santa Teresa, inició la reforma de los frailes descalzos. Por ello fue encarcelado en Toledo, donde compuso parte del «Cántico espiritual».',
      'Sus poemas y comentarios —«Subida del Monte Carmelo», «Noche oscura», «Llama de amor viva»— son cumbres de la mística y de la poesía en castellano.',
    ],
    quote: '«En el atardecer de la vida te examinarán en el amor».',
    lesson: 'Dejarlo todo para encontrar al Todo.',
  },
  {
    id: 'rosa-lima', name: 'Santa Rosa de Lima', feast: '08-23', life: '1586 – 1617', region: 'Lima (Perú)', patron: 'Patrona de América, Filipinas y la Policía del Perú', emoji: '🌹',
    bio: [
      'Isabel Flores de Oliva fue llamada Rosa por su belleza. Terciaria dominica, vivió en una pequeña ermita en el huerto de su casa, entregada a la oración y la penitencia, mientras ayudaba a su familia con su trabajo.',
      'Atendía a enfermos y pobres en su propia casa. Fue la primera santa canonizada de América (1671).',
    ],
    quote: '«Fuera de la cruz no hay otra escalera por donde subir al cielo».',
    lesson: 'Santidad escondida en la vida doméstica y el servicio a los pobres.',
  },
  {
    id: 'martin-porres', name: 'San Martín de Porres', feast: '11-03', life: '1579 – 1639', region: 'Lima (Perú)', patron: 'Patrono de la justicia social y de la paz entre razas', emoji: '🧹',
    bio: [
      'Hijo de un noble español y de una mujer liberta de origen africano, sufrió el desprecio por su condición mestiza. Aprendió el oficio de barbero y enfermero y entró como donado en el convento dominico del Rosario de Lima.',
      'Con humildad atendía a todos —frailes, pobres, esclavos e incluso animales—. Se le atribuyen numerosos milagros y la bilocación. La gente lo llamaba «fray Escoba».',
    ],
    lesson: 'La humildad y la caridad rompen todas las barreras.',
  },
  {
    id: 'juan-diego', name: 'San Juan Diego Cuauhtlatoatzin', feast: '12-09', life: '1474 – 1548', region: 'Cuautitlán – Tepeyac (México)', patron: 'Patrono de los indígenas', emoji: '🌹',
    bio: [
      'Indígena chichimeca bautizado ya adulto. En diciembre de 1531, la Virgen María se le apareció en el cerro del Tepeyac y le pidió que el obispo construyera allí un templo.',
      'Como señal, la Virgen le mandó recoger rosas en pleno invierno; al abrir su tilma ante el obispo Zumárraga apareció impresa la imagen de Nuestra Señora de Guadalupe. Vivió el resto de su vida junto a la ermita. Fue canonizado en 2002.',
    ],
    quote: '«¿No estoy yo aquí, que soy tu madre?» (palabras de la Virgen a Juan Diego, Nican Mopohua).',
    lesson: 'Dios elige a los pequeños para manifestar su ternura.',
  },
  {
    id: 'vicente-paul', name: 'San Vicente de Paúl', feast: '09-27', life: '1581 – 1660', region: 'Pouy – París (Francia)', patron: 'Patrono de las obras de caridad', emoji: '🍞',
    bio: [
      'Sacerdote de origen campesino que, tras una juventud buscando una posición cómoda, descubrió a Cristo en los pobres. Fundó la Congregación de la Misión (paúles) y, con santa Luisa de Marillac, las Hijas de la Caridad.',
      'Organizó la ayuda a enfermos, niños abandonados, galeotes y víctimas de la guerra, y renovó la formación del clero.',
    ],
    quote: '«Los pobres son nuestros amos y señores».',
    lesson: 'Servir a los pobres es servir a Cristo mismo.',
  },
  {
    id: 'juan-bosco', name: 'San Juan Bosco', feast: '01-31', life: '1815 – 1888', region: 'Turín (Italia)', patron: 'Padre y maestro de la juventud', emoji: '⚽',
    bio: [
      'Hijo de campesinos, perdió a su padre siendo niño. Un sueño a los nueve años le reveló su misión: ganar a los jóvenes «no con golpes, sino con mansedumbre y caridad». Ordenado sacerdote en Turín, recogió a muchachos pobres en el Oratorio.',
      'Creó escuelas, talleres y fundó los Salesianos y, con santa María Mazzarello, las Hijas de María Auxiliadora. Su sistema preventivo se basa en la razón, la religión y el amor.',
    ],
    quote: '«Basta que seáis jóvenes para que os ame con toda mi alma».',
    lesson: 'Educar con alegría, cercanía y fe.',
  },
  {
    id: 'juan-vianney', name: 'San Juan María Vianney', feast: '08-04', life: '1786 – 1859', region: 'Ars (Francia)', patron: 'Patrono de los párrocos', emoji: '⛪',
    bio: [
      'Con muchas dificultades para estudiar, llegó a ser sacerdote y fue enviado a Ars, una pequeña aldea casi indiferente a la fe. Con oración, penitencia y caridad transformó el pueblo.',
      'Pasaba hasta dieciséis horas diarias en el confesionario; peregrinos de toda Francia acudían a él. Es modelo de los sacerdotes.',
    ],
    quote: '«El sacerdocio es el amor del Corazón de Jesús».',
    lesson: 'La santidad sencilla de quien se entrega por su pueblo.',
  },
  {
    id: 'bernardita', name: 'Santa Bernardita Soubirous', feast: '04-16', life: '1844 – 1879', region: 'Lourdes – Nevers (Francia)', patron: 'Patrona de los enfermos', emoji: '💧',
    bio: [
      'Hija de una familia muy pobre de Lourdes, enfermiza y sin instrucción. En 1858 la Virgen se le apareció dieciocho veces en la gruta de Massabielle, pidió penitencia y oración, hizo brotar una fuente y se presentó: «Yo soy la Inmaculada Concepción».',
      'Después ingresó en las Hermanas de la Caridad de Nevers, donde vivió humildemente y con mucho sufrimiento. Su cuerpo se conserva incorrupto.',
    ],
    quote: '«La Virgen se sirvió de mí como de una escoba: cuando ya no se necesita, se la deja detrás de la puerta».',
    lesson: 'La humildad es el terreno donde Dios obra maravillas.',
  },
  {
    id: 'teresita', name: 'Santa Teresa del Niño Jesús', feast: '10-01', life: '1873 – 1897', region: 'Alençon – Lisieux (Francia)', patron: 'Doctora de la Iglesia; patrona de las misiones', emoji: '🌸',
    bio: [
      'Hija de los santos Luis y Celia Martin, entró en el Carmelo de Lisieux a los 15 años. Descubrió el «caminito» de la infancia espiritual: confianza total en el amor misericordioso de Dios y amor en las cosas pequeñas.',
      'Murió de tuberculosis a los 24 años. Su autobiografía, «Historia de un alma», se difundió por todo el mundo. Sin salir del convento es patrona de las misiones; fue declarada doctora de la Iglesia en 1997.',
    ],
    quote: '«En el corazón de la Iglesia, mi Madre, yo seré el amor».',
    lesson: 'Hacer las cosas pequeñas con un amor grande.',
  },
  {
    id: 'padre-pio', name: 'San Pío de Pietrelcina', feast: '09-23', life: '1887 – 1968', region: 'Pietrelcina – San Giovanni Rotondo (Italia)', patron: 'Patrono de los voluntarios de protección civil', emoji: '✋',
    bio: [
      'Fraile capuchino que en 1918 recibió los estigmas, que llevó durante cincuenta años. Su vida estuvo marcada por la oración, el sufrimiento ofrecido y largas jornadas en el confesionario.',
      'Fundó la «Casa Alivio del Sufrimiento», un gran hospital, y los Grupos de Oración. Sufrió incomprensiones e investigaciones con obediencia. Fue canonizado en 2002.',
    ],
    quote: '«Reza, espera y no te preocupes».',
    lesson: 'Unir los propios sufrimientos a los de Cristo por la salvación de las almas.',
  },
  {
    id: 'faustina', name: 'Santa Faustina Kowalska', feast: '10-05', life: '1905 – 1938', region: 'Głogowiec – Cracovia (Polonia)', patron: 'Apóstol de la Divina Misericordia', emoji: '❤️‍🔥',
    bio: [
      'Religiosa sencilla de la Congregación de Nuestra Señora de la Misericordia, con escasa instrucción. Jesús se le manifestó pidiéndole difundir el mensaje de su misericordia, pintar la imagen con la inscripción «Jesús, en ti confío» y establecer la fiesta de la Divina Misericordia.',
      'Escribió su «Diario». Murió a los 33 años. Juan Pablo II la canonizó en el año 2000 e instituyó el Domingo de la Divina Misericordia.',
    ],
    quote: '«Jesús, en ti confío».',
    lesson: 'Ningún pecado es mayor que la misericordia de Dios.',
  },
  {
    id: 'maximiliano-kolbe', name: 'San Maximiliano María Kolbe', feast: '08-14', life: '1894 – 1941', region: 'Polonia – Auschwitz', patron: 'Patrono de los periodistas y de los presos', emoji: '🕊️',
    bio: [
      'Franciscano conventual, fundó la Milicia de la Inmaculada y una gran «Ciudad de la Inmaculada» (Niepokalanów), desde donde difundía publicaciones católicas; también misionó en Japón.',
      'Arrestado por los nazis y enviado a Auschwitz, se ofreció a morir en lugar de un padre de familia condenado al búnker del hambre. Murió con una inyección de fenol el 14 de agosto de 1941.',
    ],
    quote: '«Solo el amor crea».',
    lesson: 'Dar la vida por los amigos, como Cristo.',
  },
  {
    id: 'teresa-calcuta', name: 'Santa Teresa de Calcuta', feast: '09-05', life: '1910 – 1997', region: 'Skopie – Calcuta (India)', patron: 'Patrona de los voluntarios', emoji: '🤲',
    bio: [
      'Agnes Gonxha Bojaxhiu, religiosa de Loreto, recibió en 1946 la «llamada dentro de la llamada»: servir a Cristo en los más pobres de los pobres. Fundó las Misioneras de la Caridad, que se extendieron por todo el mundo.',
      'Atendió a moribundos, leprosos y niños abandonados. Recibió el Nobel de la Paz en 1979. Vivió años de oscuridad interior sin dejar de sonreír. Fue canonizada en 2016.',
    ],
    quote: '«No todos podemos hacer grandes cosas, pero sí cosas pequeñas con gran amor».',
    lesson: 'Ver a Jesús en el rostro de cada pobre.',
  },
  {
    id: 'juan-pablo-ii', name: 'San Juan Pablo II', feast: '10-22', life: '1920 – 2005', region: 'Wadowice (Polonia) – Roma', patron: 'Patrono de las familias y de la Jornada Mundial de la Juventud', emoji: '⛰️',
    bio: [
      'Karol Wojtyła vivió la ocupación nazi y el comunismo; fue obrero, actor, sacerdote, profesor y arzobispo de Cracovia. Elegido papa en 1978, inició su pontificado con «¡No tengáis miedo! ¡Abrid de par en par las puertas a Cristo!».',
      'Realizó 104 viajes apostólicos, creó las Jornadas Mundiales de la Juventud, promulgó el Catecismo y contribuyó a la caída del comunismo. Sufrió un atentado en 1981 y perdonó a su agresor. Fue canonizado en 2014.',
    ],
    quote: '«¡No tengáis miedo!»',
    lesson: 'Totus tuus: abandono confiado en Cristo por María.',
  },
  {
    id: 'carlo-acutis', name: 'San Carlo Acutis', feast: '10-12', life: '1991 – 2006', region: 'Londres – Milán – Asís', patron: 'Patrono de internet y de los jóvenes', emoji: '💻',
    bio: [
      'Adolescente milanés apasionado por la informática, los videojuegos y el fútbol, que desde niño vivió un gran amor a la Eucaristía: iba a Misa a diario y la llamaba «mi autopista hacia el cielo». Creó una exposición digital sobre los milagros eucarísticos.',
      'Murió de leucemia a los 15 años ofreciendo sus sufrimientos por el Papa y la Iglesia. Su cuerpo reposa en Asís. Fue canonizado el 7 de septiembre de 2025, junto a Pier Giorgio Frassati.',
    ],
    quote: '«Todos nacen como originales, pero muchos mueren como fotocopias».',
    lesson: 'La santidad es posible hoy, también en el mundo digital.',
  },
  {
    id: 'jose-gregorio', name: 'San José Gregorio Hernández', feast: '10-26', life: '1864 – 1919', region: 'Isnotú – Caracas (Venezuela)', patron: 'Médico de los pobres', emoji: '🩺',
    bio: [
      'Médico y científico venezolano, pionero de la bacteriología en su país, formado en París. Unía la excelencia profesional con una fe profunda: atendía gratuitamente a los pobres e incluso les compraba las medicinas.',
      'Intentó varias veces la vida religiosa, pero su vocación fue la santidad como laico. Murió atropellado al salir a llevar medicinas a una anciana. Fue canonizado el 19 de octubre de 2025.',
    ],
    lesson: 'La ciencia y la profesión vividas como servicio cristiano.',
  },
  {
    id: 'alberto-hurtado', name: 'San Alberto Hurtado', feast: '08-18', life: '1901 – 1952', region: 'Santiago (Chile)', patron: 'Patrono de los trabajadores en Chile', emoji: '🏠',
    bio: [
      'Jesuita chileno, educador y apóstol social. Conmovido por los niños que dormían en la calle, fundó el Hogar de Cristo para acoger a los más desamparados, y promovió la formación de sindicatos cristianos.',
      'Murió de cáncer a los 51 años repitiendo «Contento, Señor, contento». Fue canonizado en 2005.',
    ],
    quote: '«El pobre es Cristo».',
    lesson: 'La fe se hace compromiso por la justicia.',
  },
]

/** Santo del día: coincidencia exacta de fiesta o el más cercano */
export function santoDelDia(d = new Date()): Santo {
  const key = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const exact = SANTOS.find((s) => s.feast === key)
  if (exact) return exact
  const doy = (mmdd: string) => {
    const [m, dd] = mmdd.split('-').map(Number)
    return m * 31 + dd
  }
  const t = doy(key)
  return [...SANTOS].sort((a, b) => ((doy(a.feast) - t + 400) % 400) - ((doy(b.feast) - t + 400) % 400))[0]
}

export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const fechaFiesta = (mmdd: string) => {
  const [m, d] = mmdd.split('-').map(Number)
  return `${d} de ${MESES[m - 1]}`
}
