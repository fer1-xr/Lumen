# Lumen · Estudio Católico

Aplicación web para estudiar la Biblia católica (versión de Mons. Juan Straubinger) y la doctrina de la Iglesia, con resaltados de colores, comentarios personales, un jardín 3D de ciudades bíblicas que crece con tu lectura y un mapa 3D interactivo.

## Módulos

| Módulo | Qué incluye |
|---|---|
| **Biblia** | 73 libros, 1.334 capítulos, 35.473 versículos y 12.871 notas de Mons. Straubinger. Lector con temas claro/sepia/oscuro, tamaño de letra, títulos de perícopas, introducciones, marcadores, «leído» por capítulo y lugares del capítulo enlazados al mapa. |
| **Resaltados y comentarios** | Selecciona cualquier texto (o toca un versículo) → 6 colores con significado personalizable, comentarios con citas y `#etiquetas`. Funciona en todos los módulos (Biblia, Catecismo, Documentos pontificios, Santos, Oraciones). |
| **Buscar** | Búsqueda en toda la Biblia (sin acentos, por palabras o «frase exacta»), o salto directo a una cita: `Jn 3,16`, `1 Co 13`. |
| **Catecismo** | Estructura completa del CEC (≈90 unidades, §1–2865) con resúmenes de estudio, ideas clave, citas bíblicas y enlace al texto oficial en vatican.va. |
| **Documentos pontificios** | Textos completos de vatican.va, de León XIII a León XIV: encíclicas, exhortaciones y cartas apostólicas, constituciones, motu proprio, bulas, breves, cartas, discursos, mensajes, homilías, audiencias, Ángelus y más. Filtros por tipo y papa, búsqueda por título, «solo en español» (si vatican.va no tiene traducción se muestra el texto original), resaltados y comentarios por párrafo. Datos generados con `scripts/vaticano/` (ver abajo). |
| **Santos** | 38 vidas de santos, santo del día, orden por calendario o por historia. |
| **Oraciones** | Oraciones tradicionales, Santo Rosario con los misterios del día (enlazados a la Biblia) y los 21 concilios ecuménicos. |
| **Planes de lectura** | Evangelios en 30 días, NT en 90, Salmos y Proverbios en 60, Pentateuco en 40, Biblia en un año. |
| **Jardín 3D** | 15 ciudades (Edén, Sinaí, Jericó, Jerusalén, Casa de la Sabiduría, Babilonia, Nínive, Jerusalén restaurada, Belén, Cafarnaúm, Roma, Éfeso, Vaticano, Asís, Nueva Jerusalén), cada una con 5 etapas que se construyen según lo que lees. Incluye «vista previa completa». |
| **Mapa 3D** | Relieve real de Tierra Santa y del mundo bíblico, 1.336 lugares geolocalizados con sus citas, búsqueda, filtro por libro y rutas (Abraham, Éxodo, vida de Jesús, viajes de San Pablo). |
| **Resaltados y notas** | Apartado propio (en el menú y en la barra del lector) donde se reúnen automáticamente todos tus resaltados y comentarios, ordenados por libro y capítulo, con el versículo completo y tus notas debajo. Filtros por libro, color, módulo y #etiqueta; búsqueda; descarga en .txt e impresión; marcadores; significado de los colores y copia de seguridad (.json). |

Los datos personales se guardan en el navegador (localStorage). Usa «Resaltados y notas → Colores y copia de seguridad» para no perderlos.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # genera dist/ (sitio estático)
npm run preview    # sirve dist/
```

El sitio compilado es estático (usa rutas con `#`), así que puede publicarse en cualquier hosting (Vercel, Netlify, GitHub Pages…).

## Regenerar los datos

Los scripts de `scripts/` generan `public/data/`:

- `parse.py <raw> <salida>` — convierte las entradas de la API de WordPress de bibliastraubinger.com (`/wp-json/wp/v2/posts`) en un JSON por libro con versículos, títulos y notas.
- `geo.py <doc.kml> <places.json>` — convierte el KMZ de lugares de OpenBible.info.
- `terrain.py <tiles> <natural-earth> <salida>` — descarga teselas de elevación y genera relieve sombreado y mapas de altura.

## Fuentes y licencias

- **Texto bíblico y notas**: Sagrada Biblia, versión de Mons. Juan Straubinger (1883–1956), según la edición digital de [bibliastraubinger.com](https://bibliastraubinger.com/).
- **Catecismo y encíclicas**: los resúmenes son guías de estudio propias; el texto oficial (© Libreria Editrice Vaticana) se enlaza en [vatican.va](https://www.vatican.va/).
- **Lugares bíblicos**: [OpenBible.info Bible Geocoding Data](https://www.openbible.info/geo/), CC BY 4.0.
- **Relieve**: Mapzen Terrain Tiles en AWS (SRTM, GMTED, ETOPO1 y otras fuentes).
- **Costas, lagos y ríos**: [Natural Earth](https://www.naturalearthdata.com/) (dominio público).
- 3D con [three.js](https://threejs.org/).

## Documentos pontificios (vatican.va)

Los textos están en `public/data/vaticano/` (índice y paquetes `.json.gz`, se descomprimen en el navegador). Para regenerarlos:

```bash
cd scripts/vaticano
python3 crawl.py                      # recorre los índices de vatican.va → index.json
python3 fetch.py encyclicals,letters,speeches 16   # descarga los textos de esas categorías
python3 build.py <carpeta_docs> ../../public/data/vaticano
```
