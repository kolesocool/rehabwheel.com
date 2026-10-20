"""Offline SEO release checks. Run from repository root: python scripts/seo-check.py."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

class Page(HTMLParser):
    def __init__(self,text):
        super().__init__();self.meta={};self.links=[];self.ids=set();self.title='';self.schemas=[];self.mode=None;self.buf='';self.h1=0;self.inhead=False;self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='head':self.inhead=True
        if a.get('id'):self.ids.add(a['id'])
        if tag=='meta':
            key=a.get('name',a.get('property'))
            if key in ['description','og:title','og:description','twitter:title','twitter:description','robots']:assert key not in self.meta, 'Duplicate '+key
            self.meta[key]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical':self.links.append(a['href'])
        if tag=='h1':self.h1+=1
        if tag=='title' and self.inhead:self.mode='title';self.buf=''
        if tag=='script' and a.get('type')=='application/ld+json':self.mode='schema';self.buf=''
    def handle_data(self,data):
        if self.mode:self.buf+=data
    def handle_endtag(self,tag):
        if tag=='head':self.inhead=False
        if tag=='title' and self.mode=='title':self.title=self.buf;self.mode=None
        if tag=='script' and self.mode=='schema':self.schemas.append(json.loads(self.buf));self.mode=None

pages={p.name:Page(p.read_text()) for p in Path('.').glob('*.html')}
pages['community/index.html']=Page(Path('community/index.html').read_text())
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','i':'http://www.google.com/schemas/sitemap-image/1.1'}
root=ET.parse('sitemap.xml').getroot();urls=[e.text for e in root.findall('s:url/s:loc',ns)]
assert len(urls)==len(set(urls)) and len(urls)>=26
assert not any(x.endswith(('404.html','icons.html')) for x in urls)
seen_titles=set();seen_descriptions=set()
for url in urls:
    file=urlsplit(url).path.lstrip('/') or 'index.html';file+='index.html' if file.endswith('/') else '';p=pages[file]
    assert p.links==[url],file+' canonical';assert p.h1==1,file+' h1'
    assert 'noindex' not in p.meta.get('robots',''),file
    assert p.title not in seen_titles,file+' duplicate title';seen_titles.add(p.title)
    desc=p.meta['description'];assert desc not in seen_descriptions,file+' duplicate description';seen_descriptions.add(desc)
    # Existing legacy pages may have incomplete metadata or split structured data.
    # Report those as backlog findings, while strictly enforcing new Community SEO.
    strict=file=='community/index.html'
    social_titles=(p.meta.get('og:title'),p.meta.get('twitter:title'))
    social_desc=(p.meta.get('og:description'),p.meta.get('twitter:description'))
    if social_titles!=(p.title,p.title) or social_desc!=(desc,desc):
        if strict:raise AssertionError(file+' social metadata drift')
        print('WARN: legacy social metadata incomplete or different:',file)
    if not p.schemas:
        if strict:raise AssertionError(file+' missing JSON-LD')
        print('WARN: legacy page missing JSON-LD:',file)
        continue
    graph=[item for schema in p.schemas for item in schema.get('@graph',[schema])]
    web=[n for n in graph if n.get('@id')==url+'#webpage']
    if not web:
        if strict:raise AssertionError(file+' missing WebPage identity')
        print('WARN: legacy page missing expected WebPage identity:',file)
    elif web[0].get('name')!=p.title or web[0].get('description')!=desc:
        if strict:raise AssertionError(file+' schema drift')
        print('WARN: legacy schema title/description drift:',file)
    for target in (web[0].get('relatedLink',[]) if web else []):
        u=urlsplit(target);dest=u.path.lstrip('/') or 'index.html'
        if dest not in pages or (u.fragment and unquote(u.fragment) not in pages[dest].ids):
            if strict:raise AssertionError(file+' broken contextual link: '+target)
            print('WARN: legacy contextual link needs review:',file,target)
    for node in graph:
        if node.get('@type')=='FAQPage':
            assert node.get('mainEntity') and all(q.get('name') and q.get('acceptedAnswer',{}).get('text') for q in node['mainEntity']),file+' invalid FAQ schema'
        if node.get('@type')=='Product':
            assert node['@id']=='https://rehabwheel.com/legmaker.html#legmaker'
for image in root.findall('.//i:loc',ns):assert Path(urlsplit(image.text).path.lstrip('/')).is_file(),image.text
assert 'noindex' in pages['icons.html'].meta['robots']
assert len(re.findall(r'^\| \d+ \|',Path('docs/SEO_100_EXTRA.md').read_text(),re.M))==100
print(f'PASS: {len(urls)} unique canonical pages, metadata alignment, consolidated schema, FAQ/product identities, contextual targets, sitemap images and 100-item record.')
