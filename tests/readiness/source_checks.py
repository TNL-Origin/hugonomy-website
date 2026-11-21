"""Credential-free website source gate. Does not certify hosted behavior."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re, subprocess, tomllib
from build_public import ROOT, OUT, build
build()
errors=[]
class Links(HTMLParser):
    def __init__(self): super().__init__(); self.urls=[]
    def handle_starttag(self,tag,attrs):
        for k,v in attrs:
            if k in ('src','href','poster') and v: self.urls.append(v)
for p in OUT.rglob('*.html'):
    text=p.read_text(encoding='utf-8'); parser=Links();parser.feed(text)
    for url in parser.urls:
        u=urlsplit(url)
        if u.scheme or u.netloc or not u.path: continue
        target=OUT/unquote(u.path).lstrip('/') if u.path.startswith('/') else p.parent/unquote(u.path)
        if not (target.is_file() or (target/'index.html').is_file() or target.with_suffix('.html').is_file()): errors.append(f'{p.relative_to(OUT)}: missing {url}')
    if re.search(r'<script[^>]+src=["\']https://www.googletagmanager.com',text): errors.append(f'{p.name}: unconditional analytics')
for p in OUT.rglob('*.js'):
    result=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    if result.returncode: errors.append(result.stderr)
cfg=tomllib.loads((ROOT/'netlify.toml').read_text())
assert cfg['build']['publish']=='public-site'
csp=cfg['headers'][0]['values']['Content-Security-Policy']
assert "frame-ancestors 'self'" in csp and 'unsafe-eval' not in csp
assert not any(p.suffix in {'.md','.py','.yml','.toml'} for p in OUT.rglob('*'))
for p in OUT.rglob('*'):
    if p.is_file() and p.suffix in {'.html','.js','.css','.json','.svg','.txt'}:
        text=p.read_text(encoding='utf-8')
        if re.search(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bAKIA[A-Z0-9]{16}\b',text):errors.append(f'{p.relative_to(OUT)}: credential pattern')
        if re.search(r'patent[- ]pending|63/856',text,re.I):errors.append(f'{p.relative_to(OUT)}: forbidden public wording')
assert not errors,'\n'.join(errors)
print('PASS: public-file boundary, local links, JavaScript syntax, analytics gate, CSP baseline and credential-pattern scan')
