import re, sys, json, html, os, concurrent.futures as cf
sys.path.insert(0,'/tmp/claude-0/s/tools'); from crawl import get
OUT='/tmp/claude-0/s/docs'; os.makedirs(OUT,exist_ok=True)
cats=set(sys.argv[1].split(','))
idx=[x for x in json.load(open('/tmp/claude-0/s/index.json')) if x['cat'] in cats]
KEEP={'p','br','i','em','b','strong','h1','h2','h3','h4','h5','blockquote','ul','ol','li','sup','sub','u','hr','table','tr','td','th','tbody'}
def clean(t):
    m=t.find('<div class="testo">')
    if m<0: m=t.find('<div class="documento">')
    if m<0: return ''
    t=t[m:]
    k=t.find('vaticanrichtext"><p'); k2=t.find('container vaticanrichtext')
    k=k2 if k2>0 else k
    if k>0: t=t[t.rfind('<div',0,k):]
    e=t.find('<div class="bottom-container')
    for mark in ['<div class="bottom-container','<!-- FOOTER','<footer']:
        e=t.find(mark)
        if e>0: t=t[:e]; break
    t=re.sub(r'<(script|style)[^>]*>.*?</\1>','',t,flags=re.S|re.I)
    t=re.sub(r'<!--.*?-->','',t,flags=re.S)
    def tag(m):
        close,name=m.group(1),m.group(2).lower()
        if name=='font': return ''
        if name not in KEEP: return ''
        if name in('p','h1','h2','h3','h4','h5') and not close:
            a=re.search(r'align="?(center|right)',m.group(0),re.I)
            return f'<{name} class="{a.group(1).lower()}">' if a else f'<{name}>'
        return f'<{close}{name}>'
    t=re.sub(r'<(/?)([a-zA-Z0-9]+)[^>]*>',tag,t)
    t=html.unescape(t).replace('\xa0',' ')
    t=t.replace('<','\0').replace('>','\1')  # protect
    t=t.replace('&','&amp;').replace('\0','<').replace('\1','>')
    t=re.sub(r'<p[^>]*>\s*</p>','',t); t=re.sub(r'(<br>\s*){3,}','<br><br>',t)
    t=re.sub(r'[ \t\r\f\v]+',' ',t); t=re.sub(r'\n\s*','\n',t)
    c=t.find('Copyright ©')
    if c>0: t=t[:t.rfind('<p',0,c) if t.rfind('<p',0,c)>0 else c]
    return t.strip()
def one(x):
    f=os.path.join(OUT,x['url'].split('/')[-1][:-5]+'__'+x['pope']+'.json')
    if os.path.exists(f): return 0
    body=clean(get(x['url']))
    json.dump({**x,'html':body},open(f,'w'),ensure_ascii=False); return len(body)
with cf.ThreadPoolExecutor(int(sys.argv[2]) if len(sys.argv)>2 else 16) as ex:
    n=0
    for s in ex.map(one,idx):
        n+=1
        if n%500==0: print(n,flush=True)
print('done',len(idx))
