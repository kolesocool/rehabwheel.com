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
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9','i':'http://www.google.com/schemas/sitemap-image/1.1'}
root=ET.parse('sitemap.xml').getroot();urls=[e.text for e in root.findall('s:url/s:loc',ns)]
assert len(urls)==len(set(urls))==23
assert not any(x.endswith(('404.html','icons.html')) for x in urls)
seen_titles=set();seen_descriptions=set()
for url in urls:
    file=urlsplit(url).path.lstrip('/') or 'index.html';p=pages[file]
    assert p.links==[url],file+' canonical';assert p.h1==1,file+' h1'
    assert 'noindex' not in p.meta.get('robots',''),file
    assert p.title not in seen_titles,file+' duplicate title';seen_titles.add(p.title)
    desc=p.meta['description'];assert desc not in seen_descriptions,file+' duplicate description';seen_descriptions.add(desc)
    assert p.title==p.meta['og:title']==p.meta['twitter:title'],file+' title drift'
    assert desc==p.meta['og:description']==p.meta['twitter:description'],file+' description drift'
    assert len(p.schemas)==1,file+' fragmented schema';graph=p.schemas[0]['@graph']
    web=[n for n in graph if n.get('@id')==url+'#webpage'];assert len(web)==1,file+' page identity'
    assert web[0]['name']==p.title and web[0]['description']==desc,file+' schema drift'
    for target in web[0]['relatedLink']:
        u=urlsplit(target);dest=u.path.lstrip('/') or 'index.html';assert dest in pages,target
        if u.fragment:assert unquote(u.fragment) in pages[dest].ids,target
    for node in graph:
        if node.get('@type')=='FAQPage':assert node['mainEntity'] and all(q['name'] and q['acceptedAnswer']['text'] for q in node['mainEntity'])
        if node.get('@type')=='Product':assert node['@id']=='https://rehabwheel.com/legmaker.html#legmaker'
for image in root.findall('.//i:loc',ns):assert Path(urlsplit(image.text).path.lstrip('/')).is_file(),image.text
assert 'noindex' in pages['icons.html'].meta['robots']
assert len(re.findall(r'^\| \d+ \|',Path('docs/SEO_100_EXTRA.md').read_text(),re.M))==100
print('PASS: 23 unique canonical pages, metadata alignment, consolidated schema, FAQ/product identities, contextual targets, sitemap images and 100-item record.')
