"""Convierte los documentos descargados (fetch.py) en los datos estáticos de la app.

Uso: python3 build.py <carpeta_docs> <carpeta_salida public/data/vaticano>
"""
import json, os, re, sys, glob, html

SRC, OUT = sys.argv[1], sys.argv[2]
POPES = [
    ('leo-xiii', 'León XIII'), ('pius-x', 'San Pío X'), ('benedict-xv', 'Benedicto XV'), ('pius-xi', 'Pío XI'),
    ('pius-xii', 'Pío XII'), ('john-xxiii', 'San Juan XXIII'), ('paul-vi', 'San Pablo VI'), ('john-paul-i', 'Beato Juan Pablo I'),
    ('john-paul-ii', 'San Juan Pablo II'), ('benedict-xvi', 'Benedicto XVI'), ('francesco', 'Francisco'), ('leo-xiv', 'León XIV'),
]
CATS = [
    ('encyclicals', 'Encíclicas'), ('apost_exhortations', 'Exhortaciones apostólicas'), ('apost_constitutions', 'Constituciones apostólicas'),
    ('apost_letters', 'Cartas apostólicas'), ('motu_proprio', 'Motu proprio'), ('bulls', 'Bulas'), ('briefs', 'Breves'),
    ('letters', 'Cartas'), ('speeches', 'Discursos'), ('messages', 'Mensajes'), ('homilies', 'Homilías'),
    ('audiences', 'Audiencias'), ('angelus', 'Ángelus y Regina Coeli'), ('cotidie', 'Meditaciones matutinas'),
    ('prayers', 'Oraciones'), ('travels', 'Viajes apostólicos'), ('otros', 'Otros'),
]
CATMAP = {'apost-constitutions': 'apost_constitutions'}
pidx = {p: i for i, (p, _) in enumerate(POPES)}
cidx = {c: i for i, (c, _) in enumerate(CATS)}

def date_of(slug):
    m = re.search(r'_(\d{2})(\d{2})(\d{4})(?:_|$)', slug)
    if m and 1800 < int(m.group(3)) < 2100: return f'{m.group(3)}-{m.group(2)}-{m.group(1)}'
    m = re.search(r'(?:^|[_-])((?:18|19|20)\d{2})(\d{2})(\d{2})(?:[_-]|$)', slug)
    if m: return f'{m.group(1)}-{m.group(2)}-{m.group(3)}'
    return ''

BLOCK = re.compile(r'<(p|h1|h2|h3|h4|h5|li|blockquote|td)(?: class="(\w+)")?>(.*?)</\1>', re.S)
def inline(s):
    s = re.sub(r'<(/?)(i|em)>', r'<\1em>', s)
    s = re.sub(r'<(/?)(b|strong)>', r'<\1strong>', s)
    s = re.sub(r'<br>', '\n', s)
    s = re.sub(r'<(?!/?(em|strong)>)[^>]+>', '', s)   # resto de etiquetas fuera
    s = re.sub(r'<(em|strong)>(\s*)</\1>', r'\2', s)
    s = re.sub(r'[ \t]+', ' ', s); s = re.sub(r' *\n *', '\n', s)
    return s.strip()

def blocks(h):
    h = re.sub(r'<(/?)(table|tbody|tr|ul|ol|hr|th|u|sup|sub)>', lambda m: ' ' if m.group(2) in ('sup','sub','u') else '', h)
    out = []
    for tag, cls, body in BLOCK.findall(h):
        t = inline(body)
        if not t or t in ('*', '* * *'): 
            if t: out.append(['c', t])
            continue
        k = 'h' if tag[0] == 'h' else 'q' if tag == 'blockquote' else 'c' if cls == 'center' else 'r' if cls == 'right' else 'p'
        out.append([k, t])
    if not out:  # texto sin párrafos
        t = inline(h)
        out = [['p', x] for x in t.split('\n\n') if x.strip()]
    return out

import gzip
CHUNK = 700_000  # bytes de texto aproximados por paquete
docs, groups = [], {}
os.makedirs(os.path.join(OUT, 'c'), exist_ok=True)
for f in sorted(glob.glob(os.path.join(SRC, '*.json'))):
    d = json.load(open(f))
    cat = CATMAP.get(d['cat'], d['cat'])
    if cat not in cidx: cat = 'otros'
    if d['pope'] not in pidx: continue
    slug = d['url'].split('/')[-1][:-5]
    b = blocks(d['html'])
    if not b: continue
    title = re.sub(r'\s+', ' ', d['title']).strip()
    words = sum(len(x[1].split()) for x in b)
    row = [d['pope'] + '.' + slug, title, pidx[d['pope']], cidx[cat], date_of(slug), d['lang'], d['url'], words]
    docs.append(row)
    groups.setdefault((row[2], row[3]), []).append((row, b))

def gz(path, obj):
    with gzip.open(path, 'wt', encoding='utf-8', compresslevel=9) as fh:
        json.dump(obj, fh, ensure_ascii=False, separators=(',', ':'))

n = 0
for key in sorted(groups):
    items = sorted(groups[key], key=lambda x: (x[0][4] or '9999', x[0][0]))
    pack, size = {}, 0
    def flush():
        global n, pack, size
        if pack:
            gz(os.path.join(OUT, 'c', f'{n}.json.gz'), pack); n += 1
        pack, size = {}, 0
    for row, b in items:
        row.append(n)
        pack[row[0]] = b
        size += sum(len(x[1]) for x in b)
        if size > CHUNK: flush()
    flush()
docs.sort(key=lambda x: (x[4] or '9999', x[1]))
gz(os.path.join(OUT, 'index.json.gz'), {'popes': POPES, 'cats': CATS, 'docs': docs})
print(len(docs), 'documentos en', n, 'paquetes')
