import re, sys, json, html, urllib.request, concurrent.futures as cf, os
B='https://www.vatican.va'
POPES=['leo-xiii','pius-x','benedict-xv','pius-xi','pius-xii','john-xxiii','paul-vi','john-paul-i','john-paul-ii','benedict-xvi','francesco','leo-xiv']
CACHE='/tmp/claude-0/s/cache'; os.makedirs(CACHE,exist_ok=True)
def get(u):
    f=os.path.join(CACHE,re.sub(r'[^\w.-]','_',u)[-200:])
    if os.path.exists(f): return open(f,encoding='utf-8',errors='replace').read()
    for i in range(4):
        try:
            t=urllib.request.urlopen(B+u,timeout=60).read().decode('utf-8','replace'); break
        except Exception as e:
            if '404' in str(e): t=''; break
            t=None
    if t is None: t=''
    open(f,'w',encoding='utf-8').write(t); return t
ITEM=re.compile(r'<div class="item">\s*<h2>(.*?)</h2>(.*?)</div>\s*</div>',re.S)
def strip(s): return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>','',s))).strip()
def crawl(pope):
    root=get(f'/content/{pope}/es.html')
    cats=sorted(set(re.findall(rf'/content/{pope}/es/([\w-]+)\.index\.html',root)))
    out=[]; seen=set()
    def walk(path,cat):
        if path in seen: return
        seen.add(path); t=get(f'/content/{pope}/es/{path}.index.html')
        for h2,rest in ITEM.findall(t):
            links=re.findall(r'href="(/content/[^"]+?/documents/[^"]+\.html)"',h2+rest)
            if not links: continue
            pick=None
            for lang in ['es','it','la','en','fr','pt','de']:
                for l in links:
                    if f'/content/{pope}/{lang}/' in l: pick=(lang,l); break
                if pick: break
            if not pick: pick=('?',links[0])
            out.append({'pope':pope,'cat':cat,'title':strip(h2),'lang':pick[0],'url':pick[1]})
        for sub in sorted(set(re.findall(rf'/content/{pope}/es/({re.escape(path)}/[\w-]+)\.index\.html',t))):
            walk(sub,cat)
    for c in cats: walk(c,c)
    return out
if __name__=='__main__':
    allx=[]
    with cf.ThreadPoolExecutor(12) as ex:
        for r in ex.map(crawl,POPES): allx+=r
    # dedupe
    d={}
    for x in allx: d.setdefault(x['url'],x)
    json.dump(list(d.values()),open('/tmp/claude-0/s/index.json','w'),ensure_ascii=False)
    from collections import Counter
    c=Counter((x['pope'],x['cat']) for x in d.values())
    for k,v in sorted(c.items()): print(k,v)
    print(len(d))
