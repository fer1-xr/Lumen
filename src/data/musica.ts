/** Música sacra — grabaciones disponibles en Internet Archive */
export interface Pista {
  id: string
  title: string
  composer: string
  performer?: string
  style: 'Orquestal' | 'Coral' | 'Gregoriano' | 'Solista'
  note: string
  src: string
  custom?: boolean
}

const f = (item: string, file: string) => `https://archive.org/download/${item}/${encodeURIComponent(file)}`

export const PISTAS: Pista[] = [
  { id: 'barber-agnus', title: 'Agnus Dei', composer: 'Samuel Barber', performer: 'Choir of New College Oxford', style: 'Coral', note: 'Versión coral del célebre Adagio para cuerdas: «Cordero de Dios, que quitas el pecado del mundo, danos la paz».', src: f('BarberAgnusDeiChoirOfNewCollegeOxford', 'Barber Agnus Dei Choir of New College Oxford.mp3') },
  { id: 'allegri', title: 'Miserere mei, Deus', composer: 'Gregorio Allegri', style: 'Coral', note: 'Salmo 51 compuesto para la Capilla Sixtina; durante siglos sólo se cantaba allí en Semana Santa.', src: f('GregorioAllegriMiserere', 'Gregorio Allegri - Miserere.mp3') },
  { id: 'mozart-introitus', title: 'Requiem: Introitus', composer: 'W. A. Mozart', style: 'Orquestal', note: '«Dales, Señor, el descanso eterno». La última obra de Mozart, K. 626.', src: f('01-mozart-requiem-in-d-minor-k.-626-1.-introitus-requiem', '01 Mozart- Requiem in D minor, K.626 - 1. Introitus- Requiem.mp3') },
  { id: 'mozart-kyrie', title: 'Requiem: Kyrie', composer: 'W. A. Mozart', style: 'Orquestal', note: 'Doble fuga sobre «Señor, ten piedad».', src: f('01-mozart-requiem-in-d-minor-k.-626-1.-introitus-requiem', '02 Mozart- Requiem in D minor, K.626 - 2. Kyrie.mp3') },
  { id: 'mozart-dies', title: 'Requiem: Dies irae', composer: 'W. A. Mozart', style: 'Orquestal', note: 'La secuencia del Juicio Final, con toda la fuerza de coro y orquesta.', src: f('01-mozart-requiem-in-d-minor-k.-626-1.-introitus-requiem', '03 Mozart- Requiem in D minor, K.626 - 3. Sequentia- Dies irae.mp3') },
  { id: 'mozart-lacrimosa', title: 'Requiem: Lacrimosa', composer: 'W. A. Mozart', style: 'Orquestal', note: '«Día de lágrimas»: los últimos compases que Mozart alcanzó a escribir.', src: f('001.WolfgangAmadeusMozartRequiemK.626Lacrimosa', '001. Wolfgang Amadeus Mozart - Requiem (K. 626) - Lacrimosa.mp3') },
  { id: 'ave-verum', title: 'Ave verum corpus', composer: 'W. A. Mozart', performer: 'Herbert von Karajan', style: 'Orquestal', note: 'Motete eucarístico: «Salve, verdadero Cuerpo nacido de María Virgen».', src: f('MozartAveVerumCorpusK.618karajan', '13Mozart_AveVerumCorpusK618.mp3') },
  { id: 'vivaldi-gloria', title: 'Gloria in excelsis Deo', composer: 'Antonio Vivaldi', style: 'Orquestal', note: 'Apertura luminosa del Gloria RV 589, escrita por el «cura rojo» de Venecia.', src: f('Vivaldi_gloria2011', '13GloriaInExcelsisDeo.mp3') },
  { id: 'vivaldi-pax', title: 'Et in terra pax', composer: 'Antonio Vivaldi', style: 'Orquestal', note: '«Y en la tierra paz a los hombres que ama el Señor».', src: f('Vivaldi_gloria2011', '14EtInTerraPaxHominibus.mp3') },
  { id: 'vivaldi-laudamus', title: 'Laudamus te', composer: 'Antonio Vivaldi', style: 'Orquestal', note: 'Dúo de sopranos: «Te alabamos, te bendecimos».', src: f('Vivaldi_gloria2011', '15LaudamusTe.mp3') },
  { id: 'stabat', title: 'Stabat Mater dolorosa', composer: 'G. B. Pergolesi', style: 'Orquestal', note: 'La Madre dolorosa al pie de la Cruz.', src: f('StabatMaterPergolesi', '02-stabatMater-StabatMaterDolorosa.mp3') },
  { id: 'in-paradisum', title: 'Requiem: In Paradisum', composer: 'Gabriel Fauré', style: 'Orquestal', note: '«Al Paraíso te lleven los ángeles».', src: f('GabrielFaureRequiemOp.48VII.InParadisumFromTheThinRedLine', 'Gabriel Faure - Requiem, Op. 48, VII. In Paradisum (From The Thin Red Line).mp3') },
  { id: 'panis', title: 'Panis angelicus', composer: 'César Franck', style: 'Solista', note: 'Texto de Santo Tomás de Aquino para la solemnidad del Corpus Christi.', src: f('CesarFranckPanisAngelicus', 'Franck-PanisAngelicus.mp3') },
  { id: 'ave-maria', title: 'Ave Maria', composer: 'Franz Schubert', style: 'Solista', note: 'Una de las melodías marianas más queridas del mundo.', src: f('FranzSchubertAveMaria', 'Franz Schubert_ Ave Maria.mp3') },
  { id: 'locus-iste', title: 'Locus iste', composer: 'Anton Bruckner', performer: 'Stadsknapenkoor Gorcum', style: 'Coral', note: '«Este lugar lo hizo Dios», gradual para la dedicación de una iglesia.', src: f('StadsknapenkoorGorcum_CD1996_14_LocusIste_Bruckner', 'StadsknapenkoorGorcum_CD1996_14_LocusIste_Bruckner.mp3') },
  { id: 'veni-creator', title: 'Veni Creator Spiritus', composer: 'Canto gregoriano', style: 'Gregoriano', note: 'Himno al Espíritu Santo del siglo IX, atribuido a Rabano Mauro.', src: f('VeniCreatorSpiritus', 'VeniCreatorSpiritus-CantoGregoriano.mp3') },
]
