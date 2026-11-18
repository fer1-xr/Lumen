import re, json, sys, html
src, out = sys.argv[1], sys.argv[2]
k = open(src, encoding='utf-8').read()
OSIS = {'Gen':'gn','Exod':'ex','Lev':'lv','Num':'nm','Deut':'dt','Josh':'jos','Judg':'jue','Ruth':'rt','1Sam':'1s','2Sam':'2s','1Kgs':'1r','2Kgs':'2r','1Chr':'1cr','2Chr':'2cr','Ezra':'esd','Neh':'ne','Tob':'tb','Jdt':'jdt','Esth':'est','1Macc':'1m','2Macc':'2m','Job':'job','Ps':'sal','Prov':'pr','Eccl':'ecl','Song':'ct','Wis':'sab','Sir':'eclo','Isa':'is','Jer':'jr','Lam':'lm','Bar':'ba','Ezek':'ez','Dan':'dn','Hos':'os','Joel':'jl','Amos':'am','Obad':'abd','Jonah':'jon','Mic':'mi','Nah':'na','Hab':'ha','Zeph':'so','Hag':'ag','Zech':'za','Mal':'ml','Matt':'mt','Mark':'mc','Luke':'lc','John':'jn','Acts':'hch','Rom':'rm','1Cor':'1co','2Cor':'2co','Gal':'ga','Eph':'ef','Phil':'flp','Col':'col','1Thess':'1ts','2Thess':'2ts','1Tim':'1tm','2Tim':'2tm','Titus':'tt','Phlm':'flm','Heb':'hb','Jas':'st','1Pet':'1p','2Pet':'2p','1John':'1jn','2John':'2jn','3John':'3jn','Jude':'jds','Rev':'ap'}
places = []
for f in re.findall(r'<Folder>(.*?)</Folder>', k, re.S):
    name = html.unescape(re.search(r'<name>(.*?)</name>', f).group(1)).strip()
    desc = re.search(r'<description><!\[CDATA\[(.*?)\]\]></description>', f, re.S)
    refs = []
    if desc:
        for m in re.finditer(r'search=([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)', desc.group(1)):
            b = OSIS.get(m.group(1))
            if b: refs.append([b, int(m.group(2)), int(m.group(3))])
    style = re.search(r'<styleUrl>#(\w+)</styleUrl>', f)
    style = style.group(1) if style else 'landpoint'
    pt = re.search(r'<Point>\s*<coordinates>([-\d.]+),([-\d.]+)', f)
    if pt:
        lon, lat = float(pt.group(1)), float(pt.group(2))
    else:
        c = re.search(r'<coordinates>(.*?)</coordinates>', f, re.S)
        if not c: continue
        pts = [tuple(map(float, p.split(',')[:2])) for p in c.group(1).split() if ',' in p]
        lon = sum(p[0] for p in pts) / len(pts); lat = sum(p[1] for p in pts) / len(pts)
    kind = 'water' if 'water' in style else ('region' if style in ('region', 'landisobands') else 'land')
    seen = set(); refs = [r for r in refs if not (tuple(r) in seen or seen.add(tuple(r)))]
    places.append({'en': name, 'lat': round(lat, 4), 'lon': round(lon, 4), 'k': kind, 'r': refs})
json.dump(places, open(out, 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(places), sum(1 for p in places if p['k']=='land'), 'lat range', min(p['lat'] for p in places), max(p['lat'] for p in places), 'lon', min(p['lon'] for p in places), max(p['lon'] for p in places))
