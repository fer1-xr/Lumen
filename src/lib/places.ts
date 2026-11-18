import { useEffect, useState } from 'react'

export interface Place {
  id: string
  en: string
  es: string
  lat: number
  lon: number
  k: 'land' | 'water' | 'region'
  r: [string, number, number][]
}

/** Nombres en español de los lugares más citados (forma habitual en las Biblias católicas) */
const ES: Record<string, string> = {
  Jerusalem: 'Jerusalén', Egypt: 'Egipto', Babylon: 'Babilonia', Jordan: 'Río Jordán', Moab: 'Moab', Zion: 'Sion', Assyria: 'Asiria',
  Samaria: 'Samaria', Edom: 'Edom', Ammon: 'Amón', Canaan: 'Canaán', Syria: 'Siria', Gilead: 'Galaad', Chaldea: 'Caldea',
  Galilee: 'Galilea', Bethel: 'Betel', Jericho: 'Jericó', Tyre: 'Tiro', Hebron: 'Hebrón', Damascus: 'Damasco', Lebanon: 'Líbano',
  Bethlehem: 'Belén', Judea: 'Judea', Bashan: 'Basán', Midian: 'Madián', Sodom: 'Sodoma', Gibeah: 'Gabaa', 'City of David': 'Ciudad de David',
  Nile: 'Río Nilo', Shechem: 'Siquem', Euphrates: 'Río Éufrates', Negeb: 'Négueb', Gath: 'Gat', Mizpah: 'Masfa', Gibeon: 'Gabaón',
  Gilgal: 'Gálgala', Heshbon: 'Hesebón', Ramah: 'Ramá', Shiloh: 'Silo', Sidon: 'Sidón', 'Great Sea': 'Mar Grande (Mediterráneo)',
  Jezreel: 'Jezrael', Ai: 'Hai', 'Mount Seir': 'Monte Seir', Beersheba: 'Bersabee', Nazareth: 'Nazaret', 'Mount Sinai': 'Monte Sinaí',
  Nineveh: 'Nínive', 'Red Sea': 'Mar Rojo', Amalek: 'Amalec', Persia: 'Persia', Arabah: 'Arabá', Dan: 'Dan', 'Mount Zion': 'Monte Sion',
  Gomorrah: 'Gomorra', 'Kadesh-barnea': 'Cades Barne', Macedonia: 'Macedonia', 'Most Holy Place': 'Santo de los Santos', Hamath: 'Emat',
  'Holy Place': 'Lugar Santo', Antioch: 'Antioquía', Gaza: 'Gaza', Lachish: 'Laquis', Philistia: 'Filistea', Ashdod: 'Azoto', Asia: 'Asia',
  'Salt Sea': 'Mar Salado (Mar Muerto)', Tarshish: 'Tarsis', 'Beth-shemesh': 'Betsamés', Cush: 'Cus (Etiopía)', Ekron: 'Acarón',
  Ephesus: 'Éfeso', 'Jabesh-gilead': 'Jabes de Galaad', 'Ramoth-gilead': 'Ramot de Galaad', Susa: 'Susa', 'Kiriath-jearim': 'Cariatiarim',
  Sheba: 'Sabá', Shephelah: 'Sefela', Anathoth: 'Anatot', Caesarea: 'Cesarea', Capernaum: 'Cafarnaúm', East: 'Oriente', Geba: 'Gabaa (Geba)',
  Libnah: 'Lebná', 'Mount Carmel': 'Monte Carmelo', 'Mount of Olives': 'Monte de los Olivos', Rabbah: 'Rabbá', Aroer: 'Aroer',
  Hazor: 'Asor', 'Mount Horeb': 'Monte Horeb', 'Beyond the River': 'Transeufratina', Eden: 'Edén', Elam: 'Elam', Mahanaim: 'Mahanaim',
  'Mount Hermon': 'Monte Hermón', Babylonia: 'Babilonia (región)', Keilah: 'Ceila', Rome: 'Roma', South: 'Mediodía', Carmel: 'Carmel',
  Gezer: 'Guézer', Goshen: 'Gosen', Joppa: 'Jope', Kidron: 'Torrente Cedrón', Succoth: 'Sucot', Tekoa: 'Técoa', Zobah: 'Sobá',
  Bethany: 'Betania', Debir: 'Dabir', Jazer: 'Jaser', Timnah: 'Timna', Tirzah: 'Tirsá', 'Wilderness of Sinai': 'Desierto del Sinaí',
  Ziklag: 'Siceleg', Arnon: 'Río Arnón', Ashkelon: 'Ascalón', Cyprus: 'Chipre', Dibon: 'Dibón', Haran: 'Harán', 'Lebo-hamath': 'Entrada de Emat',
  Megiddo: 'Meguidó', Meribah: 'Meribá', 'Mount Hor': 'Monte Hor', Riblah: 'Ribla', 'Valley of Hinnom': 'Valle de Hinnom (Gehena)',
  Aram: 'Aram', Corinth: 'Corinto', Geshur: 'Gesur', Kedesh: 'Cades', Media: 'Media', Michmash: 'Macmás', 'Paddan-aram': 'Padán Aram',
  'Valley of the Arnon': 'Valle del Arnón', Zorah: 'Sarea', Achaia: 'Acaya', Nebo: 'Nebo', North: 'Norte', Ophir: 'Ofir',
  'Sea of Galilee': 'Mar de Galilea', Zin: 'Desierto de Sin', Adullam: 'Odollam', Aijalon: 'Ayalón', Aphek: 'Afec', Beeroth: 'Berot',
  Bozrah: 'Bosra', 'Brook of Egypt': 'Torrente de Egipto', Crete: 'Creta', Gerar: 'Gerar', Hormah: 'Hormá', Jahaz: 'Jasa', Kedar: 'Cedar',
  'Mount Tabor': 'Monte Tabor', Rimmon: 'Remón', Shunem: 'Sunam', Thessalonica: 'Tesalónica', Topheth: 'Tófet', Zoar: 'Segor',
  Arabia: 'Arabia', 'Beth-shan': 'Betsán', Chebar: 'Río Cobar', Cilicia: 'Cilicia', Edrei: 'Edrai', Eglon: 'Eglón', Eshtaol: 'Estaol',
  'Jordan Valley': 'Valle del Jordán', Maacah: 'Maacá', Makkedah: 'Maceda', Memphis: 'Menfis', 'Mount Gilboa': 'Monte Gelboé',
  Netophah: 'Netofá', Paran: 'Desierto de Farán', Peor: 'Fogor', Pisgah: 'Fasga', Shinar: 'Senaar', 'Valley of Rephaim': 'Valle de los Refaím',
  Ar: 'Ar', Ashtaroth: 'Astarot', Azekah: 'Azeca', Bahurim: 'Bahurim', 'Beth-aven': 'Betaven', 'Beth-horon': 'Bethorón', Bethsaida: 'Betsaida',
  Cyrene: 'Cirene', Dedan: 'Dedán', Ethiopia: 'Etiopía', 'Ezion-geber': 'Asiongaber', Gihon: 'Gihón', Greece: 'Grecia', Jabbok: 'Río Jaboc',
  Jarmuth: 'Jarmut', Jebus: 'Jebús', Lod: 'Lida', Luz: 'Luz', Mesopotamia: 'Mesopotamia', Nob: 'Nob', Ophrah: 'Efrá', Rehob: 'Rohob',
  Sharon: 'Sarón', Taanach: 'Tanac', Tahpanhes: 'Tafnis', Zoan: 'Tanis', Arpad: 'Arfad', Athens: 'Atenas', Berea: 'Berea', Elath: 'Elat',
  Engedi: 'Engadí', 'En-rogel': 'Fuente de Rogel', Galatia: 'Galacia', Iconium: 'Iconio', Laodicea: 'Laodicea', Lystra: 'Listra',
  Machpelah: 'Macpelá', Mamre: 'Mambré', Mareshah: 'Maresá', Migdol: 'Migdol', Penuel: 'Fanuel', Put: 'Put (Libia)', Shur: 'Sur',
  Teman: 'Temán', Thebes: 'Tebas', Troas: 'Tróade', Ziph: 'Zif', Abarim: 'Abarim', Admah: 'Adamá', Caphtor: 'Caftor', Derbe: 'Derbe',
  Heliopolis: 'Heliópolis (On)', Kishon: 'Torrente Cisón', Marah: 'Mara', Massah: 'Masá', Medeba: 'Medaba', 'Mount Ebal': 'Monte Ebal',
  'Mount Gerizim': 'Monte Garizim', Ophel: 'Ofel', Pamphylia: 'Panfilia', Rameses: 'Ramesés', Rephidim: 'Rafidim', Sela: 'Sela (Petra)',
  Shittim: 'Setim', Siloam: 'Siloé', Tarsus: 'Tarso', 'Valley of Achor': 'Valle de Acor', 'Valley of Jezreel': 'Valle de Jezrael',
  Alexandria: 'Alejandría', Arad: 'Arad', Ararat: 'Ararat', Arimathea: 'Arimatea', Asshur: 'Asur', 'Beth-zur': 'Betsur', Cana: 'Caná',
  Chinnereth: 'Ceneret', 'City of Palms': 'Ciudad de las Palmeras', Dor: 'Dor', Elim: 'Elim', Golgotha: 'Gólgota', Italy: 'Italia',
  Philippi: 'Filipos', Phoenicia: 'Fenicia', Salem: 'Salem', Thyatira: 'Tiatira', Tishbe: 'Tesbe', Ur: 'Ur de los Caldeos',
  Zarephath: 'Sarepta', Areopagus: 'Areópago', Bethphage: 'Betfagé', Carchemish: 'Carquemis', Decapolis: 'Decápolis', Ebenezer: 'Ebenezer',
  Emmaus: 'Emaús', 'En-dor': 'Endor', Ephraim: 'Efraín', Ephrath: 'Efrata', Gennesaret: 'Genesaret', Gerasa: 'Gerasa', Libya: 'Libia',
  Miletus: 'Mileto', Pergamum: 'Pérgamo', Smyrna: 'Esmirna', Sardis: 'Sardes', Philadelphia: 'Filadelfia', Patmos: 'Patmos', Malta: 'Malta',
  Colossae: 'Colosas', Antipatris: 'Antípatris', Lydda: 'Lida', Puteoli: 'Puteoli', Syracuse: 'Siracusa', Rhegium: 'Regio', Sychar: 'Sicar',
  Magdala: 'Magdala', Chorazin: 'Corozaín', Nain: 'Naím', 'Pool of Bethesda': 'Piscina de Betesda', Gethsemane: 'Getsemaní', Bithynia: 'Bitinia',
  Cappadocia: 'Capadocia', Pontus: 'Ponto', Phrygia: 'Frigia', Mysia: 'Misia', Lycaonia: 'Licaonia', Pisidia: 'Pisidia', Samothrace: 'Samotracia',
  Neapolis: 'Neápolis', Amphipolis: 'Anfípolis', Apollonia: 'Apolonia', Cenchreae: 'Cencreas', Attalia: 'Atalía', Perga: 'Perge', Paphos: 'Pafos',
  Salamis: 'Salamina', Seleucia: 'Seleucia', Rhodes: 'Rodas', Cos: 'Cos', Assos: 'Asón', Mitylene: 'Mitilene', Chios: 'Quío', Samos: 'Samos',
  Spain: 'España', Illyricum: 'Iliria', Dalmatia: 'Dalmacia', Nicopolis: 'Nicópolis', Cnidus: 'Gnido', 'Fair Havens': 'Buenos Puertos',
  Clauda: 'Cauda', 'Three Taverns': 'Tres Tabernas', 'Forum of Appius': 'Foro de Apio', Azotus: 'Azoto', Gaulanitis: 'Gaulanítide',
  Idumea: 'Idumea', Ituraea: 'Iturea', Trachonitis: 'Traconítide', Abilene: 'Abilene', Nazirite: 'Nazareo', 'Caesarea Philippi': 'Cesarea de Filipo',
  Gadara: 'Gadara', Aenon: 'Ennón', Ephesians: 'Éfeso', Calvary: 'Calvario', Tiberias: 'Tiberíades', 'Sea of Tiberias': 'Mar de Tiberíades',
  Sinai: 'Sinaí', Ararat2: 'Ararat', 'Tower of Babel': 'Torre de Babel', Shushan: 'Susa', Pishon: 'Río Fisón', Tigris: 'Río Tigris',
  Hiddekel: 'Río Tigris', Nod: 'Nod', Enoch: 'Henoc', Accad: 'Acad', Erech: 'Uruk (Erec)', Calah: 'Calaj', Resen: 'Resén', Gomer: 'Gomer',
  Javan: 'Javán', Elishah: 'Elisá', Kittim: 'Quitim', Dodanim: 'Dodanim', Uz: 'Hus', Buz: 'Buz', Ellasar: 'Elasar', 'Valley of Siddim': 'Valle de Sidim',
  'Valley of Shaveh': 'Valle de Savé', 'Beer-lahai-roi': 'Pozo del Viviente que me ve', Moriah: 'Moria', 'Mount Moriah': 'Monte Moria',
  Peniel: 'Fanuel', 'Abel-mizraim': 'Abel-Misraim', Pithom: 'Pitom', Sin: 'Desierto de Sin', 'Wilderness of Sin': 'Desierto de Sin',
  'Wilderness of Paran': 'Desierto de Farán', 'Wilderness of Zin': 'Desierto de Sin (Zin)', 'Wilderness of Judea': 'Desierto de Judá',
  'Plains of Moab': 'Llanuras de Moab', 'Mount Nebo': 'Monte Nebo', Ebal: 'Ebal', Gerizim: 'Garizim', Gibbethon: 'Gebetón', Ramoth: 'Ramot',
  Gozan: 'Gozán', Halah: 'Halaj', Habor: 'Habor', Calneh: 'Calne', Hena: 'Ana', Sepharvaim: 'Sefarvaim', Kir: 'Kir', Golan: 'Golán',
  Bezer: 'Bosor', Tob: 'Tob', Salecah: 'Saleca', Lehi: 'Lehí', Etam: 'Etam', Tamar: 'Tamar', Gebal: 'Biblos (Gebal)', Ahava: 'Ahavá',
  Magog: 'Magog', Meshech: 'Mosoc', Tubal: 'Tubal', Lud: 'Lud', Pathros: 'Patros', Kerioth: 'Cariot', Moresheth: 'Moréset', 'Mount Ephraim': 'Monte de Efraín',
  'Hill Country of Ephraim': 'Montaña de Efraín', Naphtali: 'Neftalí', Zebulun: 'Zabulón', Asher: 'Aser', Issachar: 'Isacar', Benjamin: 'Benjamín',
  Judah: 'Judá', Manasseh: 'Manasés', Reuben: 'Rubén', Gad: 'Gad', Simeon: 'Simeón', 'Mount Gilead': 'Monte Galaad', Armageddon: 'Armagedón',
  'Valley of Jehoshaphat': 'Valle de Josafat', Millo: 'Mello', Senir: 'Sanir', Sirion: 'Sirión', Zaphon: 'Safón', Tadmor: 'Palmira (Tadmor)',
  Pelusium: 'Pelusio', 'Valley of Salt': 'Valle de la Sal', Zeboiim: 'Seboím', 'Water Gate': 'Puerta del Agua', 'Fish Gate': 'Puerta de los Peces',
  'Sheep Gate': 'Puerta de las Ovejas', 'Dung Gate': 'Puerta del Estiércol', 'Valley Gate': 'Puerta del Valle', 'Horse Gate': 'Puerta de los Caballos',
  'East Gate': 'Puerta Oriental', 'Fountain Gate': 'Puerta de la Fuente', 'Corner Gate': 'Puerta del Ángulo', 'Benjamin Gate': 'Puerta de Benjamín',
  'Ephraim Gate': 'Puerta de Efraín', 'Tower of Hananel': 'Torre de Hananeel', 'House of the Forest of Lebanon': 'Casa del Bosque del Líbano',
  Ophel2: 'Ofel', Naioth: 'Nayot', Bethesda: 'Betesda', 'Pool of Siloam': 'Piscina de Siloé', Antonia: 'Torre Antonia', Praetorium: 'Pretorio',
}

const PATTERNS: [RegExp, string][] = [
  [/^Mount (.+)$/, 'Monte $1'],
  [/^Valley of (.+)$/, 'Valle de $1'],
  [/^Wilderness of (.+)$/, 'Desierto de $1'],
  [/^Desert of (.+)$/, 'Desierto de $1'],
  [/^Sea of (.+)$/, 'Mar de $1'],
  [/^Brook (.+)$/, 'Torrente $1'],
  [/^Pool of (.+)$/, 'Piscina de $1'],
  [/^Plain of (.+)$/, 'Llanura de $1'],
  [/^(.+) Gate$/, 'Puerta de $1'],
  [/^(.+) River$/, 'Río $1'],
]

function toSpanish(en: string) {
  const base = en.replace(/\s*\(.*\)/, '').replace(/\s+\d+$/, '').trim()
  if (ES[base]) return ES[base]
  for (const [re, rep] of PATTERNS) {
    const m = re.exec(base)
    if (m) return rep.replace('$1', ES[m[1]] || m[1])
  }
  return base
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

let cache: Promise<Place[]> | null = null
export function loadPlaces(): Promise<Place[]> {
  if (!cache)
    cache = fetch(`${import.meta.env.BASE_URL}data/geo/places.json`)
      .then((r) => r.json())
      .then((arr: Omit<Place, 'id' | 'es'>[]) => {
        const used = new Set<string>()
        return arr.map((p) => {
          let id = slug(p.en) || 'lugar'
          while (used.has(id)) id += '-b'
          used.add(id)
          return { ...p, id, es: toSpanish(p.en) }
        })
      })
  return cache
}

export function usePlaces() {
  const [p, setP] = useState<Place[] | null>(null)
  useEffect(() => {
    loadPlaces().then(setP)
  }, [])
  return p
}

export const placeName = (p: Place) => p.es

/** Nombre alternativo / desambiguación que viene en los datos originales */
export function placeAlt(p: Place) {
  const m = /\((.*)\)/.exec(p.en)
  const num = /\s(\d+)(?:\s|$)/.exec(p.en.replace(/\(.*\)/, ''))
  return [num ? `nº ${num[1]}` : '', m ? m[1] : ''].filter(Boolean).join(' · ')
}
