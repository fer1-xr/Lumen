/** Oraciones tradicionales de la Iglesia (dominio público) */
export interface Oracion {
  id: string
  title: string
  group: string
  text: string
}

export const ORACIONES: Oracion[] = [
  { id: 'senal-cruz', group: 'Oraciones básicas', title: 'La señal de la Cruz', text: 'Por la señal de la Santa Cruz,\nde nuestros enemigos\nlíbranos, Señor, Dios nuestro.\nEn el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.' },
  { id: 'padre-nuestro', group: 'Oraciones básicas', title: 'Padre Nuestro', text: 'Padre nuestro, que estás en el cielo,\nsantificado sea tu Nombre;\nvenga a nosotros tu reino;\nhágase tu voluntad\nen la tierra como en el cielo.\nDanos hoy nuestro pan de cada día;\nperdona nuestras ofensas,\ncomo también nosotros perdonamos\na los que nos ofenden;\nno nos dejes caer en la tentación,\ny líbranos del mal. Amén.' },
  { id: 'ave-maria', group: 'Oraciones básicas', title: 'Ave María', text: 'Dios te salve, María,\nllena eres de gracia,\nel Señor es contigo.\nBendita tú eres entre todas las mujeres,\ny bendito es el fruto de tu vientre, Jesús.\nSanta María, Madre de Dios,\nruega por nosotros, pecadores,\nahora y en la hora de nuestra muerte. Amén.' },
  { id: 'gloria', group: 'Oraciones básicas', title: 'Gloria', text: 'Gloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre,\npor los siglos de los siglos. Amén.' },
  { id: 'credo', group: 'Oraciones básicas', title: 'Credo de los Apóstoles', text: 'Creo en Dios, Padre todopoderoso,\nCreador del cielo y de la tierra.\nCreo en Jesucristo, su único Hijo, Nuestro Señor,\nque fue concebido por obra y gracia del Espíritu Santo,\nnació de Santa María Virgen,\npadeció bajo el poder de Poncio Pilato,\nfue crucificado, muerto y sepultado,\ndescendió a los infiernos,\nal tercer día resucitó de entre los muertos,\nsubió a los cielos\ny está sentado a la derecha de Dios, Padre todopoderoso.\nDesde allí ha de venir a juzgar a vivos y muertos.\nCreo en el Espíritu Santo,\nla santa Iglesia católica,\nla comunión de los santos,\nel perdón de los pecados,\nla resurrección de la carne\ny la vida eterna. Amén.' },
  { id: 'credo-niceno', group: 'Oraciones básicas', title: 'Credo Niceno-Constantinopolitano', text: 'Creo en un solo Dios, Padre todopoderoso,\nCreador del cielo y de la tierra,\nde todo lo visible y lo invisible.\nCreo en un solo Señor, Jesucristo,\nHijo único de Dios,\nnacido del Padre antes de todos los siglos:\nDios de Dios, Luz de Luz,\nDios verdadero de Dios verdadero,\nengendrado, no creado,\nde la misma naturaleza del Padre,\npor quien todo fue hecho;\nque por nosotros, los hombres,\ny por nuestra salvación bajó del cielo,\ny por obra del Espíritu Santo\nse encarnó de María, la Virgen, y se hizo hombre;\ny por nuestra causa fue crucificado\nen tiempos de Poncio Pilato;\npadeció y fue sepultado,\ny resucitó al tercer día, según las Escrituras,\ny subió al cielo,\ny está sentado a la derecha del Padre;\ny de nuevo vendrá con gloria\npara juzgar a vivos y muertos,\ny su reino no tendrá fin.\nCreo en el Espíritu Santo, Señor y dador de vida,\nque procede del Padre y del Hijo,\nque con el Padre y el Hijo\nrecibe una misma adoración y gloria,\ny que habló por los profetas.\nCreo en la Iglesia,\nque es una, santa, católica y apostólica.\nConfieso que hay un solo bautismo\npara el perdón de los pecados.\nEspero la resurrección de los muertos\ny la vida del mundo futuro. Amén.' },
  { id: 'salve', group: 'Oraciones marianas', title: 'Salve Regina', text: 'Dios te salve, Reina y Madre de misericordia,\nvida, dulzura y esperanza nuestra;\nDios te salve.\nA ti llamamos los desterrados hijos de Eva;\na ti suspiramos, gimiendo y llorando\nen este valle de lágrimas.\nEa, pues, Señora, abogada nuestra,\nvuelve a nosotros esos tus ojos misericordiosos;\ny después de este destierro muéstranos a Jesús,\nfruto bendito de tu vientre.\n¡Oh clementísima, oh piadosa, oh dulce Virgen María!\nRuega por nosotros, Santa Madre de Dios,\npara que seamos dignos de alcanzar\nlas promesas de Nuestro Señor Jesucristo. Amén.' },
  { id: 'angelus', group: 'Oraciones marianas', title: 'Ángelus', text: 'V. El ángel del Señor anunció a María.\nR. Y concibió por obra del Espíritu Santo.\nDios te salve, María…\n\nV. He aquí la esclava del Señor.\nR. Hágase en mí según tu palabra.\nDios te salve, María…\n\nV. Y el Verbo se hizo carne.\nR. Y habitó entre nosotros.\nDios te salve, María…\n\nV. Ruega por nosotros, santa Madre de Dios.\nR. Para que seamos dignos de alcanzar las promesas de Cristo.\n\nOremos: Derrama, Señor, tu gracia en nuestros corazones, para que los que, por el anuncio del ángel, hemos conocido la encarnación de tu Hijo Jesucristo, por su pasión y su cruz seamos llevados a la gloria de la resurrección. Por Jesucristo nuestro Señor. Amén.' },
  { id: 'regina-coeli', group: 'Oraciones marianas', title: 'Regina Coeli (tiempo pascual)', text: 'Reina del cielo, alégrate, aleluya.\nPorque el que mereciste llevar en tu seno, aleluya,\nha resucitado, según predijo, aleluya.\nRuega por nosotros a Dios, aleluya.\n\nV. Gózate y alégrate, Virgen María, aleluya.\nR. Porque verdaderamente ha resucitado el Señor, aleluya.' },
  { id: 'memorare', group: 'Oraciones marianas', title: 'Acordaos (San Bernardo)', text: 'Acordaos, oh piadosísima Virgen María,\nque jamás se ha oído decir\nque ninguno de los que han acudido a vuestra protección,\nimplorado vuestra asistencia y reclamado vuestro socorro,\nhaya sido abandonado de vos.\nAnimado con esta confianza,\na vos también acudo, oh Madre, Virgen de las vírgenes,\ny aunque gimiendo bajo el peso de mis pecados,\nme atrevo a comparecer ante vuestra presencia soberana.\nNo desechéis, oh Madre de Dios, mis humildes súplicas,\nantes bien, escuchadlas y acogedlas benignamente. Amén.' },
  { id: 'bajo-tu-amparo', group: 'Oraciones marianas', title: 'Bajo tu amparo (Sub tuum praesidium)', text: 'Bajo tu amparo nos acogemos,\nsanta Madre de Dios;\nno deseches las súplicas\nque te dirigimos en nuestras necesidades;\nantes bien, líbranos siempre de todo peligro,\noh Virgen gloriosa y bendita. Amén.' },
  { id: 'magnificat', group: 'Oraciones marianas', title: 'Magníficat (Lc 1,46-55)', text: 'Proclama mi alma la grandeza del Señor,\nse alegra mi espíritu en Dios, mi salvador;\nporque ha mirado la humildad de su esclava.\nDesde ahora me felicitarán todas las generaciones,\nporque el Poderoso ha hecho obras grandes por mí:\nsu nombre es santo,\ny su misericordia llega a sus fieles\nde generación en generación.\nÉl hace proezas con su brazo:\ndispersa a los soberbios de corazón,\nderriba del trono a los poderosos\ny enaltece a los humildes,\na los hambrientos los colma de bienes\ny a los ricos los despide vacíos.\nAuxilia a Israel, su siervo,\nacordándose de la misericordia\n—como lo había prometido a nuestros padres—\nen favor de Abraham y su descendencia por siempre.' },
  { id: 'acto-contricion', group: 'Oraciones de cada día', title: 'Acto de contrición', text: 'Señor mío Jesucristo, Dios y Hombre verdadero,\nCreador, Padre y Redentor mío;\npor ser Tú quien eres, Bondad infinita,\ny porque te amo sobre todas las cosas,\nme pesa de todo corazón haberte ofendido;\ntambién me pesa porque puedes castigarme con las penas del infierno.\nAyudado de tu divina gracia,\npropongo firmemente nunca más pecar,\nconfesarme y cumplir la penitencia que me fuere impuesta. Amén.' },
  { id: 'angel-guarda', group: 'Oraciones de cada día', title: 'Ángel de la guarda', text: 'Ángel de mi guarda,\ndulce compañía,\nno me desampares\nni de noche ni de día.\nNo me dejes solo,\nque me perdería. Amén.' },
  { id: 'ofrecimiento', group: 'Oraciones de cada día', title: 'Ofrecimiento de obras (por la mañana)', text: 'Oh Jesús, por medio del Corazón Inmaculado de María,\nte ofrezco las oraciones, obras, alegrías y sufrimientos de este día,\nen reparación de nuestros pecados\ny por todas las intenciones de tu Sagrado Corazón. Amén.' },
  { id: 'ven-espiritu', group: 'Oraciones de cada día', title: 'Ven, Espíritu Santo', text: 'Ven, Espíritu Santo,\nllena los corazones de tus fieles\ny enciende en ellos el fuego de tu amor.\nV. Envía tu Espíritu y serán creados.\nR. Y renovarás la faz de la tierra.\n\nOremos: Oh Dios, que has instruido los corazones de tus fieles con la luz del Espíritu Santo, concédenos, según el mismo Espíritu, conocer las cosas rectas y gozar siempre de sus divinos consuelos. Por Cristo nuestro Señor. Amén.' },
  { id: 'alma-de-cristo', group: 'Oraciones de cada día', title: 'Alma de Cristo', text: 'Alma de Cristo, santifícame.\nCuerpo de Cristo, sálvame.\nSangre de Cristo, embriágame.\nAgua del costado de Cristo, lávame.\nPasión de Cristo, confórtame.\n¡Oh buen Jesús!, óyeme.\nDentro de tus llagas, escóndeme.\nNo permitas que me aparte de ti.\nDel enemigo malo, defiéndeme.\nEn la hora de mi muerte, llámame.\nY mándame ir a ti,\npara que con tus santos te alabe\npor los siglos de los siglos. Amén.' },
  { id: 'san-miguel', group: 'Oraciones de cada día', title: 'Oración a San Miguel Arcángel', text: 'San Miguel Arcángel,\ndefiéndenos en la lucha;\nsé nuestro amparo contra la perversidad y asechanzas del demonio.\nQue Dios manifieste sobre él su poder, es nuestra humilde súplica;\ny tú, Príncipe de la Milicia Celestial,\ncon el poder que Dios te ha conferido,\narroja al infierno a Satanás y a los demás espíritus malignos\nque vagan por el mundo para la perdición de las almas. Amén.' },
  { id: 'paz-francisco', group: 'Oraciones de cada día', title: 'Oración por la paz (atribuida a San Francisco)', text: 'Señor, hazme un instrumento de tu paz:\ndonde haya odio, ponga yo amor;\ndonde haya ofensa, perdón;\ndonde haya discordia, unión;\ndonde haya duda, fe;\ndonde haya error, verdad;\ndonde haya desesperación, esperanza;\ndonde haya tristeza, alegría;\ndonde haya tinieblas, luz.\nOh Maestro, que no busque yo tanto\nser consolado, como consolar;\nser comprendido, como comprender;\nser amado, como amar.\nPorque dando es como se recibe;\nperdonando, como se es perdonado;\ny muriendo en ti, como se resucita a la vida eterna.' },
  { id: 'suscipe', group: 'Oraciones de cada día', title: 'Tomad, Señor, y recibid (San Ignacio)', text: 'Tomad, Señor, y recibid toda mi libertad,\nmi memoria, mi entendimiento y toda mi voluntad;\ntodo mi haber y mi poseer.\nVos me lo disteis; a vos, Señor, lo torno.\nTodo es vuestro: disponed a toda vuestra voluntad.\nDadme vuestro amor y gracia, que esta me basta.' },
  { id: 'nada-te-turbe', group: 'Oraciones de cada día', title: 'Nada te turbe (Santa Teresa)', text: 'Nada te turbe,\nnada te espante,\ntodo se pasa,\nDios no se muda;\nla paciencia\ntodo lo alcanza;\nquien a Dios tiene\nnada le falta:\nsolo Dios basta.' },
  { id: 'coronilla', group: 'Devociones', title: 'Coronilla de la Divina Misericordia', text: 'Se reza con un rosario.\nAl inicio: Padre Nuestro, Ave María y Credo.\n\nEn las cuentas grandes:\nPadre Eterno, te ofrezco el Cuerpo y la Sangre, el Alma y la Divinidad de tu amadísimo Hijo, nuestro Señor Jesucristo, como propiciación de nuestros pecados y los del mundo entero.\n\nEn las cuentas pequeñas (10 veces):\nPor su dolorosa Pasión, ten misericordia de nosotros y del mundo entero.\n\nAl final (3 veces):\nSanto Dios, Santo Fuerte, Santo Inmortal, ten piedad de nosotros y del mundo entero.\n\nJesús, en ti confío.' },
]

export interface Misterio {
  name: string
  days: string
  items: { title: string; cita: string; ref: string }[]
}

export const MISTERIOS: Misterio[] = [
  {
    name: 'Gozosos', days: 'lunes y sábado',
    items: [
      { title: 'La Anunciación del ángel a María', cita: 'Lc 1,26-38', ref: 'lc/1?v=26' },
      { title: 'La Visitación de María a su prima Isabel', cita: 'Lc 1,39-56', ref: 'lc/1?v=39' },
      { title: 'El Nacimiento de Jesús en Belén', cita: 'Lc 2,1-20', ref: 'lc/2?v=1' },
      { title: 'La Presentación de Jesús en el Templo', cita: 'Lc 2,22-38', ref: 'lc/2?v=22' },
      { title: 'El Niño Jesús perdido y hallado en el Templo', cita: 'Lc 2,41-52', ref: 'lc/2?v=41' },
    ],
  },
  {
    name: 'Luminosos', days: 'jueves',
    items: [
      { title: 'El Bautismo de Jesús en el Jordán', cita: 'Mt 3,13-17', ref: 'mt/3?v=13' },
      { title: 'Las bodas de Caná', cita: 'Jn 2,1-12', ref: 'jn/2?v=1' },
      { title: 'El anuncio del Reino invitando a la conversión', cita: 'Mc 1,14-15', ref: 'mc/1?v=14' },
      { title: 'La Transfiguración', cita: 'Mt 17,1-8', ref: 'mt/17?v=1' },
      { title: 'La institución de la Eucaristía', cita: 'Lc 22,14-20', ref: 'lc/22?v=14' },
    ],
  },
  {
    name: 'Dolorosos', days: 'martes y viernes',
    items: [
      { title: 'La oración de Jesús en el Huerto', cita: 'Lc 22,39-46', ref: 'lc/22?v=39' },
      { title: 'La flagelación del Señor', cita: 'Jn 19,1', ref: 'jn/19?v=1' },
      { title: 'La coronación de espinas', cita: 'Mt 27,27-31', ref: 'mt/27?v=27' },
      { title: 'Jesús con la cruz a cuestas camino del Calvario', cita: 'Lc 23,26-32', ref: 'lc/23?v=26' },
      { title: 'La crucifixión y muerte de Jesús', cita: 'Lc 23,33-46', ref: 'lc/23?v=33' },
    ],
  },
  {
    name: 'Gloriosos', days: 'miércoles y domingo',
    items: [
      { title: 'La Resurrección del Señor', cita: 'Mt 28,1-10', ref: 'mt/28?v=1' },
      { title: 'La Ascensión del Señor al cielo', cita: 'Hch 1,6-11', ref: 'hch/1?v=6' },
      { title: 'La venida del Espíritu Santo', cita: 'Hch 2,1-13', ref: 'hch/2?v=1' },
      { title: 'La Asunción de María al cielo', cita: 'Ap 12,1', ref: 'ap/12?v=1' },
      { title: 'La Coronación de María como Reina de cielos y tierra', cita: 'Ap 12,1', ref: 'ap/12?v=1' },
    ],
  },
]

export function misterioDelDia(d = new Date()): Misterio {
  const day = d.getDay() // 0 domingo
  return [MISTERIOS[3], MISTERIOS[0], MISTERIOS[2], MISTERIOS[3], MISTERIOS[1], MISTERIOS[2], MISTERIOS[0]][day]
}

/** Los 21 concilios ecuménicos */
export const CONCILIOS: { n: number; name: string; year: string; desc: string }[] = [
  { n: 1, name: 'Nicea I', year: '325', desc: 'Contra Arrio: el Hijo es «consustancial» al Padre. Primera forma del Credo.' },
  { n: 2, name: 'Constantinopla I', year: '381', desc: 'Divinidad del Espíritu Santo; completa el Credo niceno-constantinopolitano.' },
  { n: 3, name: 'Éfeso', year: '431', desc: 'Unidad de la Persona de Cristo; María es «Theotokos», Madre de Dios.' },
  { n: 4, name: 'Calcedonia', year: '451', desc: 'Cristo es una Persona en dos naturalezas, sin confusión ni división.' },
  { n: 5, name: 'Constantinopla II', year: '553', desc: 'Confirma Calcedonia y condena los «Tres Capítulos».' },
  { n: 6, name: 'Constantinopla III', year: '680-681', desc: 'En Cristo hay dos voluntades, divina y humana (contra el monotelismo).' },
  { n: 7, name: 'Nicea II', year: '787', desc: 'Legitimidad de la veneración de las imágenes sagradas.' },
  { n: 8, name: 'Constantinopla IV', year: '869-870', desc: 'Cisma de Focio y autoridad de la sede romana.' },
  { n: 9, name: 'Letrán I', year: '1123', desc: 'Concordato de Worms: fin de la querella de las investiduras.' },
  { n: 10, name: 'Letrán II', year: '1139', desc: 'Reforma del clero y fin del cisma de Anacleto.' },
  { n: 11, name: 'Letrán III', year: '1179', desc: 'Elección papal por mayoría de dos tercios de los cardenales.' },
  { n: 12, name: 'Letrán IV', year: '1215', desc: 'Término «transubstanciación»; confesión y comunión pascual anuales.' },
  { n: 13, name: 'Lyon I', year: '1245', desc: 'Conflicto con el emperador Federico II; cruzada.' },
  { n: 14, name: 'Lyon II', year: '1274', desc: 'Unión temporal con los griegos; normas del cónclave.' },
  { n: 15, name: 'Vienne', year: '1311-1312', desc: 'Supresión de los templarios; reforma de la Iglesia.' },
  { n: 16, name: 'Constanza', year: '1414-1418', desc: 'Fin del Cisma de Occidente; elección de Martín V.' },
  { n: 17, name: 'Basilea-Ferrara-Florencia', year: '1431-1445', desc: 'Unión con griegos, armenios y coptos; los siete sacramentos.' },
  { n: 18, name: 'Letrán V', year: '1512-1517', desc: 'Inmortalidad del alma individual; intentos de reforma.' },
  { n: 19, name: 'Trento', year: '1545-1563', desc: 'Respuesta a la Reforma protestante: Escritura y Tradición, justificación, sacramentos, canon bíblico, seminarios.' },
  { n: 20, name: 'Vaticano I', year: '1869-1870', desc: 'Fe y razón (Dei Filius); primado e infalibilidad del Papa (Pastor Aeternus).' },
  { n: 21, name: 'Vaticano II', year: '1962-1965', desc: 'Renovación de la Iglesia: liturgia (Sacrosanctum Concilium), Iglesia (Lumen Gentium), Revelación (Dei Verbum), Iglesia y mundo (Gaudium et Spes).' },
]
