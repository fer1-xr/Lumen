import json, glob, re, html, sys, os
SRC = sys.argv[1]; OUT = sys.argv[2]
posts = []
for f in sorted(glob.glob(os.path.join(SRC, 'p*.json'))): posts += json.load(open(f))
cats = {c['id']: c['slug'] for c in json.load(open(os.path.join(SRC, 'cats.json')))}

# id, catslug, name, abbr, testament, group
BOOKS = [
 ('gn','genesis','Génesis','Gn','AT','Pentateuco'),('ex','exodo','Éxodo','Ex','AT','Pentateuco'),
 ('lv','levitico','Levítico','Lv','AT','Pentateuco'),('nm','numeros','Números','Nm','AT','Pentateuco'),
 ('dt','deuteronomio','Deuteronomio','Dt','AT','Pentateuco'),
 ('jos','josue','Josué','Jos','AT','Históricos'),('jue','jueces','Jueces','Jue','AT','Históricos'),
 ('rt','rut','Rut','Rt','AT','Históricos'),('1s','i-de-reyes-1-samuel','1 Samuel (I Reyes)','1 Sam','AT','Históricos'),
 ('2s','ii-de-reyes-2-samuel','2 Samuel (II Reyes)','2 Sam','AT','Históricos'),
 ('1r','iii-de-reyes-1-reyes','1 Reyes (III Reyes)','1 Re','AT','Históricos'),
 ('2r','iv-de-reyes-2-reyes','2 Reyes (IV Reyes)','2 Re','AT','Históricos'),
 ('1cr','i-paralipomenos-1-cronicas','1 Crónicas (I Paralipómenos)','1 Cr','AT','Históricos'),
 ('2cr','ii-paralipomenos-2-cronicas','2 Crónicas (II Paralipómenos)','2 Cr','AT','Históricos'),
 ('esd','esdras','Esdras','Esd','AT','Históricos'),('ne','nehemias','Nehemías','Ne','AT','Históricos'),
 ('tb','tobias','Tobías','Tb','AT','Históricos'),('jdt','judit','Judit','Jdt','AT','Históricos'),
 ('est','ester','Ester','Est','AT','Históricos'),('1m','1-macabeos','1 Macabeos','1 Mac','AT','Históricos'),
 ('2m','2-macabeos','2 Macabeos','2 Mac','AT','Históricos'),
 ('job','job','Job','Job','AT','Sapienciales'),('sal','salmos','Salmos','Sal','AT','Sapienciales'),
 ('pr','proverbios','Proverbios','Pr','AT','Sapienciales'),('ecl','eclesiastes-o-qoelet','Eclesiastés (Qoélet)','Ecl','AT','Sapienciales'),
 ('ct','cantar-de-los-cantares','Cantar de los Cantares','Ct','AT','Sapienciales'),
 ('sab','sabiduria','Sabiduría','Sab','AT','Sapienciales'),('eclo','eclesiastico-o-ben-sira','Eclesiástico (Ben Sirá)','Eclo','AT','Sapienciales'),
 ('is','isaias','Isaías','Is','AT','Profetas'),('jr','jeremias','Jeremías','Jr','AT','Profetas'),
 ('lm','lamentaciones','Lamentaciones','Lm','AT','Profetas'),('ba','baruc','Baruc','Ba','AT','Profetas'),
 ('ez','ezequiel','Ezequiel','Ez','AT','Profetas'),('dn','daniel','Daniel','Dn','AT','Profetas'),
 ('os','oseas','Oseas','Os','AT','Profetas'),('jl','joel','Joel','Jl','AT','Profetas'),
 ('am','amos','Amós','Am','AT','Profetas'),('abd','abdias','Abdías','Abd','AT','Profetas'),
 ('jon','jonas','Jonás','Jon','AT','Profetas'),('mi','miqueas','Miqueas','Mi','AT','Profetas'),
 ('na','nahum','Nahum','Na','AT','Profetas'),('ha','habacuc','Habacuc','Ha','AT','Profetas'),
 ('so','sofonias','Sofonías','So','AT','Profetas'),('ag','ageo','Ageo','Ag','AT','Profetas'),
 ('za','zacarias','Zacarías','Za','AT','Profetas'),('ml','malaquias','Malaquías','Ml','AT','Profetas'),
 ('mt','mateo','Mateo','Mt','NT','Evangelios'),('mc','marcos','Marcos','Mc','NT','Evangelios'),
 ('lc','lucas','Lucas','Lc','NT','Evangelios'),('jn','juan','Juan','Jn','NT','Evangelios'),
 ('hch','hechos-de-los-apostoles','Hechos de los Apóstoles','Hch','NT','Hechos'),
 ('rm','romanos','Romanos','Rm','NT','Cartas de San Pablo'),('1co','1-corintios','1 Corintios','1 Co','NT','Cartas de San Pablo'),
 ('2co','2-corintios','2 Corintios','2 Co','NT','Cartas de San Pablo'),('ga','galatas','Gálatas','Ga','NT','Cartas de San Pablo'),
 ('ef','efesios','Efesios','Ef','NT','Cartas de San Pablo'),('flp','filipenses','Filipenses','Flp','NT','Cartas de San Pablo'),
 ('col','colosenses','Colosenses','Col','NT','Cartas de San Pablo'),('1ts','1-tesalonicenses','1 Tesalonicenses','1 Ts','NT','Cartas de San Pablo'),
 ('2ts','2-tesalonicenses','2 Tesalonicenses','2 Ts','NT','Cartas de San Pablo'),('1tm','1-timoteo','1 Timoteo','1 Tm','NT','Cartas de San Pablo'),
 ('2tm','2-timoteo','2 Timoteo','2 Tm','NT','Cartas de San Pablo'),('tt','tito','Tito','Tt','NT','Cartas de San Pablo'),
 ('flm','filemon','Filemón','Flm','NT','Cartas de San Pablo'),('hb','hebreos','Hebreos','Hb','NT','Cartas de San Pablo'),
 ('st','santiago','Santiago','St','NT','Cartas católicas'),('1p','1-pedro','1 Pedro','1 P','NT','Cartas católicas'),
 ('2p','2-pedro','2 Pedro','2 P','NT','Cartas católicas'),('1jn','1-juan','1 Juan','1 Jn','NT','Cartas católicas'),
 ('2jn','2-juan','2 Juan','2 Jn','NT','Cartas católicas'),('3jn','3-juan','3 Juan','3 Jn','NT','Cartas católicas'),
 ('jds','judas','Judas','Jds','NT','Cartas católicas'),('ap','apocalipsis','Apocalipsis','Ap','NT','Apocalipsis'),
]

def clean_inline(s):
    s = re.sub(r'<(em|i)>', '<em>', s); s = re.sub(r'</(em|i)>', '</em>', s)
    s = re.sub(r'<(strong|b)>', '<strong>', s); s = re.sub(r'</(strong|b)>', '</strong>', s)
    s = re.sub(r'<(?!/?(em|strong)>)[^>]+>', '', s)
    s = html.unescape(s)
    s = s.replace('<', '\x05').replace('>', '\x06')  # protect then restore allowed
    s = re.sub('\x05(/?(?:em|strong))\x06', r'<\1>', s)
    s = s.replace('\x05', '&lt;').replace('\x06', '&gt;')
    return s

def balance(s):
    out = []; stack = []
    for part in re.split(r'(</?(?:em|strong)>)', s):
        m = re.match(r'<(/?)(em|strong)>$', part)
        if not m:
            out.append(part); continue
        if not m.group(1):
            stack.append((m.group(2), len(out))); out.append(part)
        elif stack and stack[-1][0] == m.group(2):
            stack.pop(); out.append(part)
    for tag, i in stack: out[i] = ''
    return ''.join(out)

def parse(content):
    notes = {}
    m = re.search(r'<h3[^>]*>\s*Comentarios\s*</h3>', content)
    main, foot = (content[:m.start()], content[m.end():]) if m else (content, '')
    parts = re.split(r'<(?:li|p)[^>]*id="footnote-(\d+)"[^>]*>', foot)
    for nid, body in zip(parts[1::2], parts[2::2]):
        body = re.sub(r'<a href="#footnote-ref-\d+">.*?</a>', '', body)
        t = clean_inline(body)
        t = re.sub(r'\s+', ' ', t).strip()
        t = re.sub(r'^\*\s*', '', t)
        notes[nid] = t
    main = re.sub(r'<h2[^>]*>.*?</h2>', '', main, flags=re.S)
    main = re.sub(r'<a href="#Indice">.*?</a>', '', main, flags=re.S)
    main = re.sub(r'<hr[^>]*>', '', main)
    main = re.sub(r'<sup>\s*<a [^>]*href="#footnote-(\d+)"[^>]*>.*?</a>\s*</sup>', lambda m: '\x01%s\x01' % m.group(1), main, flags=re.S)
    main = re.sub(r'<sup>\s*(?:\(\d+\)\s*)?([0-9lI]{1,3})\s*</sup>', lambda m: '\x02%s\x02' % m.group(1).replace('l','1').replace('I','1'), main)
    main = re.sub(r'<h[3-6][^>]*>(.*?)</h[3-6]>', lambda m: '\x03%s\x03' % re.sub(r'<[^>]+>', '', m.group(1)), main, flags=re.S)
    main = re.sub(r'</p>', '\x04', main)
    main = re.sub(r'<p[^>]*>', '\x07', main)
    main = clean_inline(main)
    toks = re.split(r'(\x01\d+\x01|\x02\d+\x02|\x03[^\x03]*\x03|\x04|\x07)', main)
    verses = []; cur = None; pend_head = None; newpara = True; intro = []
    buf = []; buf_closed = False; after_break = False; line_break = False
    def flush_cont():
        nonlocal buf
        if cur is not None and buf:
            for line in buf:
                cur['t'] = cur['t'].rstrip() + '\n' + line.strip()
        buf = []
    for t in toks:
        if not t: continue
        if t[0] == '\x02':
            if buf:
                if buf_closed:
                    flush_cont()
                else:
                    hd = '\n'.join(re.sub(r'<[^>]+>', '', x).strip() for x in buf if re.sub(r'<[^>]+>', '', x).strip())
                    if hd: pend_head = hd if not pend_head else pend_head + '\n' + hd
                    buf = []
            cur = {'n': int(t[1:-1]), 't': ''}
            if pend_head: cur['h'] = pend_head; pend_head = None
            if newpara: cur['p'] = 1
            newpara = False; after_break = False; line_break = False; buf_closed = False
            verses.append(cur)
        elif t[0] == '\x01':
            if cur is not None and t[1:-1] in notes:
                cur.setdefault('f', []).append(notes[t[1:-1]])
        elif t[0] == '\x03':
            flush_cont()
            h = re.sub(r'\s+', ' ', html.unescape(t[1:-1])).strip()
            if h: pend_head = h if not pend_head else pend_head + '\n' + h
        elif t == '\x04':
            newpara = True; after_break = True
            if buf: buf_closed = True
        elif t == '\x07':
            line_break = True
        else:
            txt = re.sub(r'\s+', ' ', t)
            if not re.sub(r'<[^>]+>', '', txt).strip():
                if cur is not None and not after_break: cur['t'] += txt
                continue
            if cur is None:
                intro.append(txt.strip())
                continue
            if after_break:
                buf.append(txt); buf_closed = False
                continue
            if line_break and cur['t'].strip():
                cur['t'] = cur['t'].rstrip() + '\n'
            line_break = False
            cur['t'] += txt if cur['t'] and not cur['t'].endswith('\n') else txt.lstrip()
    flush_cont()
    for v in verses:
        v['t'] = balance(re.sub(r' *\n *', '\n', v['t'])).strip()
        v['t'] = re.sub(r'\s+([.,;:!?»”’)])', r'\1', v['t'])
        v['t'] = re.sub(r'<(em|strong)>\s*</\1>', '', v['t']).strip()
        if not v.get('p'): v.pop('p', None)
    groups = [[]]
    for v in verses:
        if groups[-1] and v['n'] < groups[-1][-1]['n'] and v['n'] <= 2:
            groups.append([])
        groups[-1].append(v)
    return groups, ' '.join(intro).strip()

bycat = {}
for p in posts:
    for c in p['categories']:
        bycat.setdefault(cats.get(c), []).append(p)
os.makedirs(OUT, exist_ok=True)
index = []; total_v = 0; total_n = 0; intros = {}
for bid, cat, name, abbr, test, group in BOOKS:
    chs = []
    for p in bycat.get(cat, []):
        title = html.unescape(p['title']['rendered'])
        if not p['content']['rendered'].strip(): continue
        m = re.search(r'(\d+)(?:\s*\(([^)]*)\))?\s*$', title)
        groups, intro = parse(p['content']['rendered'])
        if not m:
            if groups[0]:
                num = 1
            else:
                if intro: intros[bid] = intro
                continue
        else:
            num = int(m.group(1))
        if not groups[0]: print('EMPTY', p['slug'], file=sys.stderr); continue
        if p['slug'] == 'salmo-112-113' and len(groups) == 3:
            for v in groups[2]: v['n'] += 8
            groups = [groups[0], groups[1] + groups[2]]
        for gi, vs in enumerate(groups):
            ch = {'c': num + gi, 'v': vs}
            if gi == 0 and m and m.group(2): ch['alt'] = m.group(2)
            if gi > 0: print('SPLIT', p['slug'], '->', num+gi, file=sys.stderr)
            chs.append(ch)
        if intro and not m: intros[bid] = intro
    chs.sort(key=lambda c: c['c'])
    nums = [c['c'] for c in chs]
    missing = [i for i in range(1, max(nums)+1) if i not in nums]
    if missing: print('MISSING', bid, missing, file=sys.stderr)
    if bid == 'sal':
        fixed = []
        for c in chs:
            if fixed and c['c'] == fixed[-1]['c'] + 1 and c['c'] == 114 and fixed[-1]['c'] == 113 and c['v'][0]['n'] == 1 and len(c['v']) == 18:
                for v in c['v']: v['n'] += 8
                fixed[-1]['v'] += c['v']; fixed[-1]['alt'] = '114-115'; continue
            fixed.append(c)
        chs = fixed
        for c in chs:
            if c['c'] == 9 and not c.get('alt'): c['alt'] = '9-10'
            if c['c'] == 118 and not c.get('alt'): c['alt'] = '119'
            if c['c'] == 113 and not c.get('alt'): c['alt'] = '114-115'
    seen=set(); chs=[c for c in chs if not (c['c'] in seen or seen.add(c['c']))]
    json.dump({'id': bid, 'name': name, 'intro': intros.get(bid), 'chapters': chs}, open(os.path.join(OUT, bid + '.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
    nv = sum(len(c['v']) for c in chs); total_v += nv
    total_n += sum(len(v.get('f', [])) for c in chs for v in c['v'])
    index.append({'id': bid, 'name': name, 'abbr': abbr, 'testament': test, 'group': group,
                  'chapters': [{'c': c['c'], 'alt': c.get('alt'), 'verses': len(c['v'])} for c in chs]})
json.dump(index, open(os.path.join(OUT, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('books', len(index), 'chapters', sum(len(b['chapters']) for b in index), 'verses', total_v, 'notes', total_n)
